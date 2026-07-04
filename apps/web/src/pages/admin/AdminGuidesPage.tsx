import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  type GuideDifficulty,
  type GuideStatus,
  type GuideType,
  type GuideVisibility,
} from '@gta6-guide/shared/content';

import { SEO } from '@/components/common';
import { ErrorState } from '@/components/feedback';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { Textarea } from '@/components/ui/Textarea';
import { AdminPageHeader, AdminRecordTable } from '@/features/admin';
import { adminService, createGuideRecord, queryKeys } from '@/services';
import { type MongoGuideDto } from '@/services/contentService';

const defaultGuideForm = {
  id: '',
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  categoryId: '',
  tags: '',
  type: 'Beginner' as GuideType,
  difficulty: 'Beginner' as GuideDifficulty,
  status: 'draft' as GuideStatus,
  visibility: 'public' as GuideVisibility,
  readTime: 5,
  isFeatured: false,
};

type GuideFormState = typeof defaultGuideForm;

function getDocumentId(document: { id?: string; _id?: string }) {
  return document.id ?? document._id ?? '';
}

function getRelationId(relation: string | { id?: string; _id?: string }) {
  return typeof relation === 'string' ? relation : getDocumentId(relation);
}

function createGuideFormState(guide: MongoGuideDto): GuideFormState {
  return {
    id: getDocumentId(guide),
    title: guide.title,
    slug: guide.slug,
    excerpt: guide.excerpt,
    content: guide.content,
    categoryId: getRelationId(guide.categoryId),
    tags: guide.tags.join(', '),
    type: guide.type,
    difficulty: guide.difficulty,
    status: guide.status,
    visibility: guide.visibility,
    readTime: guide.readTime,
    isFeatured: guide.isFeatured,
  };
}

function getTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function AdminGuidesPage() {
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState<GuideFormState>(defaultGuideForm);
  const [formMessage, setFormMessage] = useState('');
  const guidesKey = queryKeys.guides({ limit: 50, sort: 'latest', admin: true });
  const categoriesKey = queryKeys.categories({ limit: 50, admin: true });
  const guidesQuery = useQuery({
    queryKey: guidesKey,
    queryFn: adminService.listGuideRecords,
  });
  const categoriesQuery = useQuery({
    queryKey: categoriesKey,
    queryFn: adminService.listCategoryRecords,
  });

  const records = useMemo(
    () => (guidesQuery.data?.items ?? []).map(adminService.normalizeGuide).map(createGuideRecord),
    [guidesQuery.data?.items],
  );
  const categories = categoriesQuery.data?.items ?? [];
  const effectiveCategoryId = formState.categoryId || getDocumentId(categories[0] ?? {});

  const saveGuideMutation = useMutation({
    mutationFn: () => {
      const tags = getTags(formState.tags);
      const payload = {
        title: formState.title,
        slug: formState.slug || undefined,
        excerpt: formState.excerpt,
        content: formState.content,
        sections: [],
        faqs: [],
        categoryId: effectiveCategoryId,
        tags,
        tagIds: tags.map((tag) => tag.toLowerCase().replaceAll(' ', '-')),
        type: formState.type,
        difficulty: formState.difficulty,
        status: formState.status,
        visibility: formState.visibility,
        coverImage: '',
        readTime: Number(formState.readTime),
        isFeatured: formState.isFeatured,
        seo: {
          metaTitle: formState.title,
          metaDescription: formState.excerpt,
          canonicalUrl: '',
          keywords: tags,
          ogImage: '',
        },
        gameMeta: {
          missionName: '',
          characterNames: [],
          locationNames: [],
          vehicleNames: [],
          weaponNames: [],
          platform: '',
          gameVersion: '',
        },
      };

      return formState.id ? adminService.updateGuide(formState.id, payload) : adminService.createGuide(payload);
    },
    onSuccess: () => {
      setFormState(defaultGuideForm);
      setFormMessage('Guide saved successfully.');
      void queryClient.invalidateQueries({ queryKey: guidesKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminOverview });
      void queryClient.invalidateQueries({ queryKey: ['guides'] });
    },
  });

  const deleteGuideMutation = useMutation({
    mutationFn: adminService.deleteGuide,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: guidesKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminOverview });
    },
  });

  return (
    <>
      <SEO title="Admin Guides" description="Manage GTA VI guide content." />
      <main id="main-content" className="py-10 sm:py-12">
        <Container>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <AdminPageHeader
              eyebrow="Guide management"
              title="Guides"
              description="Create, edit, publish, and delete editorial guide content through backend CRUD APIs."
            />
            <Button
              onClick={() => {
                setFormState(defaultGuideForm);
                setFormMessage('');
              }}
            >
              <Plus aria-hidden className="mr-2 size-4" />
              New guide
            </Button>
          </div>

          <Card className="mt-8 p-6">
            <h2 className="text-xl font-black text-white">{formState.id ? 'Edit guide' : 'Create guide'}</h2>
            <form
              className="mt-6 grid gap-5 lg:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                setFormMessage('');
                saveGuideMutation.mutate();
              }}
            >
              <FormField label="Title">
                {(id) => (
                  <Input
                    id={id}
                    value={formState.title}
                    onChange={(event) => {
                      setFormState((current) => ({ ...current, title: event.target.value }));
                    }}
                    required
                    minLength={5}
                    maxLength={140}
                  />
                )}
              </FormField>
              <FormField label="Slug">
                {(id) => (
                  <Input
                    id={id}
                    value={formState.slug}
                    onChange={(event) => {
                      setFormState((current) => ({ ...current, slug: event.target.value }));
                    }}
                    placeholder="auto-generated when blank"
                    maxLength={160}
                  />
                )}
              </FormField>
              <FormField label="Category">
                {(id) => (
                  <Select
                    id={id}
                    value={effectiveCategoryId}
                    onChange={(event) => {
                      setFormState((current) => ({ ...current, categoryId: event.target.value }));
                    }}
                    required
                  >
                    {categories.map((category) => (
                      <option key={getDocumentId(category)} value={getDocumentId(category)}>
                        {category.title}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>
              <FormField label="Type">
                {(id) => (
                  <Select
                    id={id}
                    value={formState.type}
                    onChange={(event) => {
                      setFormState((current) => ({ ...current, type: event.target.value as GuideType }));
                    }}
                  >
                    {['Mission', 'Map', 'Vehicle', 'Character', 'Money', 'Secrets', 'Online', 'Beginner'].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>
              <FormField label="Difficulty">
                {(id) => (
                  <Select
                    id={id}
                    value={formState.difficulty}
                    onChange={(event) => {
                      setFormState((current) => ({ ...current, difficulty: event.target.value as GuideDifficulty }));
                    }}
                  >
                    {['Beginner', 'Intermediate', 'Advanced'].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>
              <FormField label="Status">
                {(id) => (
                  <Select
                    id={id}
                    value={formState.status}
                    onChange={(event) => {
                      setFormState((current) => ({ ...current, status: event.target.value as GuideStatus }));
                    }}
                  >
                    {['draft', 'review', 'published', 'archived'].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>
              <FormField label="Visibility">
                {(id) => (
                  <Select
                    id={id}
                    value={formState.visibility}
                    onChange={(event) => {
                      setFormState((current) => ({ ...current, visibility: event.target.value as GuideVisibility }));
                    }}
                  >
                    {['public', 'private', 'premium'].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>
              <FormField label="Read time">
                {(id) => (
                  <Input
                    id={id}
                    type="number"
                    min={1}
                    value={formState.readTime}
                    onChange={(event) => {
                      setFormState((current) => ({ ...current, readTime: Number(event.target.value) }));
                    }}
                  />
                )}
              </FormField>
              <FormField label="Featured">
                {(id) => (
                  <Select
                    id={id}
                    value={formState.isFeatured ? 'true' : 'false'}
                    onChange={(event) => {
                      setFormState((current) => ({ ...current, isFeatured: event.target.value === 'true' }));
                    }}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </Select>
                )}
              </FormField>
              <FormField label="Tags">
                {(id) => (
                  <Input
                    id={id}
                    value={formState.tags}
                    onChange={(event) => {
                      setFormState((current) => ({ ...current, tags: event.target.value }));
                    }}
                    placeholder="missions, beginner, route"
                  />
                )}
              </FormField>
              <div className="lg:col-span-2">
                <FormField label="Excerpt">
                  {(id) => (
                    <Textarea
                      id={id}
                      value={formState.excerpt}
                      onChange={(event) => {
                        setFormState((current) => ({ ...current, excerpt: event.target.value }));
                      }}
                      required
                      minLength={20}
                      maxLength={320}
                    />
                  )}
                </FormField>
              </div>
              <div className="lg:col-span-2">
                <FormField label="Content">
                  {(id) => (
                    <Textarea
                      id={id}
                      rows={8}
                      value={formState.content}
                      onChange={(event) => {
                        setFormState((current) => ({ ...current, content: event.target.value }));
                      }}
                      required
                      minLength={20}
                    />
                  )}
                </FormField>
              </div>
              <div className="flex flex-wrap gap-3 lg:col-span-2">
                <Button type="submit" disabled={saveGuideMutation.isPending || !effectiveCategoryId}>
                  {formState.id ? 'Update guide' : 'Create guide'}
                </Button>
                {formState.id ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setFormState(defaultGuideForm);
                      setFormMessage('');
                    }}
                  >
                    Cancel edit
                  </Button>
                ) : null}
              </div>
              {formMessage ? <p className="text-sm text-neon-cyan lg:col-span-2">{formMessage}</p> : null}
              {saveGuideMutation.isError ? (
                <p className="text-sm text-danger lg:col-span-2">Guide save failed. Check required fields and unique slug.</p>
              ) : null}
            </form>
          </Card>

          <div className="mt-8">
            {guidesQuery.isLoading ? (
              <div className="rounded-panel border border-white/10 bg-white/[0.04] p-8">
                <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
                  <Spinner />
                  Loading guide records…
                </div>
              </div>
            ) : null}

            {guidesQuery.isError ? (
              <ErrorState
                title="Could not load guides"
                description="The guide CRUD API did not return records successfully."
              />
            ) : null}

            {!guidesQuery.isLoading && !guidesQuery.isError ? (
              <AdminRecordTable
                title="Guide records"
                records={records}
                actions={(record) => (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="inline-flex h-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-text-secondary transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      onClick={() => {
                        const rawGuide = guidesQuery.data?.items.find((item) => getDocumentId(item) === record.id);

                        if (rawGuide) {
                          setFormState(createGuideFormState(rawGuide));
                          setFormMessage('');
                        }
                      }}
                    >
                      <Edit3 aria-hidden className="mr-2 size-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-9 items-center justify-center rounded-full border border-danger/20 bg-danger/10 px-3 text-xs font-semibold text-danger transition hover:bg-danger/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      onClick={() => {
                        deleteGuideMutation.mutate(record.id);
                      }}
                      disabled={deleteGuideMutation.isPending}
                    >
                      <Trash2 aria-hidden className="mr-2 size-4" />
                      Delete
                    </button>
                  </div>
                )}
              />
            ) : null}
          </div>
        </Container>
      </main>
    </>
  );
}
