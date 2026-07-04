import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FolderTree, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { type CategoryAccent } from '@gta6-guide/shared/content';

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
import { AdminPageHeader } from '@/features/admin';
import { adminService, queryKeys } from '@/services';
import { type MongoCategoryDto } from '@/services/contentService';

const defaultCategoryForm = {
  id: '',
  title: '',
  slug: '',
  description: '',
  accent: 'cyan' as CategoryAccent,
  isActive: true,
  order: 0,
};

type CategoryFormState = typeof defaultCategoryForm;

function getDocumentId(document: { id?: string; _id?: string }) {
  return document.id ?? document._id ?? '';
}

function createCategoryFormState(category: MongoCategoryDto): CategoryFormState {
  return {
    id: getDocumentId(category),
    title: category.title,
    slug: category.slug,
    description: category.description,
    accent: category.accent,
    isActive: category.isActive,
    order: category.order,
  };
}

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState<CategoryFormState>(defaultCategoryForm);
  const [formMessage, setFormMessage] = useState('');
  const categoriesKey = queryKeys.categories({ limit: 50, admin: true });
  const categoriesQuery = useQuery({
    queryKey: categoriesKey,
    queryFn: adminService.listCategoryRecords,
  });

  const normalizedCategories = useMemo(
    () => (categoriesQuery.data?.items ?? []).map(adminService.normalizeCategory),
    [categoriesQuery.data?.items],
  );

  const saveCategoryMutation = useMutation({
    mutationFn: () => {
      const payload = {
        title: formState.title,
        slug: formState.slug || undefined,
        description: formState.description,
        accent: formState.accent,
        isActive: formState.isActive,
        order: Number(formState.order),
        seo: {
          metaTitle: formState.title,
          metaDescription: formState.description,
        },
      };

      return formState.id
        ? adminService.updateCategory(formState.id, payload)
        : adminService.createCategory(payload);
    },
    onSuccess: () => {
      setFormState(defaultCategoryForm);
      setFormMessage('Category saved successfully.');
      void queryClient.invalidateQueries({ queryKey: categoriesKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.categories({ limit: 50 }) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminOverview });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: adminService.deleteCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminOverview });
    },
  });

  return (
    <>
      <SEO title="Admin Categories" description="Manage GTA VI guide categories." />
      <main id="main-content" className="py-10 sm:py-12">
        <Container>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <AdminPageHeader
              eyebrow="Taxonomy"
              title="Categories"
              description="Create, edit, delete, and publish real category records through the backend CRUD API."
            />
            <Button
              onClick={() => {
                setFormState(defaultCategoryForm);
                setFormMessage('');
              }}
            >
              <Plus aria-hidden className="mr-2 size-4" />
              New category
            </Button>
          </div>

          <Card className="mt-8 p-6">
            <h2 className="text-xl font-black text-white">
              {formState.id ? 'Edit category' : 'Create category'}
            </h2>
            <form
              className="mt-6 grid gap-5 lg:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                setFormMessage('');
                saveCategoryMutation.mutate();
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
                    minLength={2}
                    maxLength={80}
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
                    maxLength={120}
                  />
                )}
              </FormField>
              <FormField label="Accent">
                {(id) => (
                  <Select
                    id={id}
                    value={formState.accent}
                    onChange={(event) => {
                      setFormState((current) => ({ ...current, accent: event.target.value as CategoryAccent }));
                    }}
                  >
                    <option value="pink">Pink</option>
                    <option value="cyan">Cyan</option>
                    <option value="purple">Purple</option>
                  </Select>
                )}
              </FormField>
              <FormField label="Status">
                {(id) => (
                  <Select
                    id={id}
                    value={formState.isActive ? 'true' : 'false'}
                    onChange={(event) => {
                      setFormState((current) => ({ ...current, isActive: event.target.value === 'true' }));
                    }}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Select>
                )}
              </FormField>
              <FormField label="Order">
                {(id) => (
                  <Input
                    id={id}
                    type="number"
                    value={formState.order}
                    onChange={(event) => {
                      setFormState((current) => ({ ...current, order: Number(event.target.value) }));
                    }}
                  />
                )}
              </FormField>
              <div className="lg:col-span-2">
                <FormField label="Description">
                  {(id) => (
                    <Textarea
                      id={id}
                      value={formState.description}
                      onChange={(event) => {
                        setFormState((current) => ({ ...current, description: event.target.value }));
                      }}
                      required
                      minLength={10}
                      maxLength={320}
                    />
                  )}
                </FormField>
              </div>
              <div className="flex flex-wrap gap-3 lg:col-span-2">
                <Button type="submit" disabled={saveCategoryMutation.isPending}>
                  {formState.id ? 'Update category' : 'Create category'}
                </Button>
                {formState.id ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setFormState(defaultCategoryForm);
                      setFormMessage('');
                    }}
                  >
                    Cancel edit
                  </Button>
                ) : null}
              </div>
              {formMessage ? <p className="text-sm text-neon-cyan lg:col-span-2">{formMessage}</p> : null}
              {saveCategoryMutation.isError ? (
                <p className="text-sm text-danger lg:col-span-2">Category save failed. Check the form values.</p>
              ) : null}
            </form>
          </Card>

          {categoriesQuery.isLoading ? (
            <div className="mt-8 rounded-panel border border-white/10 bg-white/[0.04] p-8">
              <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
                <Spinner />
                Loading category records…
              </div>
            </div>
          ) : null}

          {categoriesQuery.isError ? (
            <div className="mt-8">
              <ErrorState
                title="Could not load categories"
                description="The category CRUD API did not return records successfully."
              />
            </div>
          ) : null}

          {!categoriesQuery.isLoading && !categoriesQuery.isError ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {normalizedCategories.map((category) => {
                const Icon = category.icon;

                return (
                  <article
                    key={category.id}
                    className="rounded-card border border-white/10 bg-white/[0.04] p-6 shadow-panel backdrop-blur-xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid size-11 place-items-center rounded-2xl border border-neon-cyan/20 bg-neon-cyan/10 text-neon-cyan">
                        <Icon aria-hidden className="size-5" />
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-text-muted">
                        {category.guideCount} guides
                      </span>
                    </div>
                    <h2 className="mt-5 text-xl font-black text-white">{category.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-text-secondary">{category.description}</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full text-sm font-semibold text-neon-cyan transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        onClick={() => {
                          const rawCategory = categoriesQuery.data?.items.find(
                            (item) => getDocumentId(item) === category.id,
                          );

                          if (rawCategory) {
                            setFormState(createCategoryFormState(rawCategory));
                            setFormMessage('');
                          }
                        }}
                      >
                        <FolderTree aria-hidden className="size-4" />
                        Edit category
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full text-sm font-semibold text-danger transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        onClick={() => {
                          deleteCategoryMutation.mutate(category.id);
                        }}
                        disabled={deleteCategoryMutation.isPending}
                      >
                        <Trash2 aria-hidden className="size-4" />
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </Container>
      </main>
    </>
  );
}
