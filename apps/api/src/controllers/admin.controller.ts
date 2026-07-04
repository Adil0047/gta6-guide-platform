import { StatusCodes } from 'http-status-codes';

import { CategoryModel } from '@/models/Category.model.js';
import { GuideModel } from '@/models/Guide.model.js';
import { UserModel } from '@/models/User.model.js';
import { listAuditLogs } from '@/services/audit.service.js';
import { asyncHandler } from '@/utils/asyncHandler.js';
import { sendResponse } from '@/utils/apiResponse.js';

export const adminOverviewController = asyncHandler(async (_request, response) => {
  const [guideCount, publishedGuideCount, categoryCount, userCount, auditLogs] = await Promise.all([
    GuideModel.countDocuments(),
    GuideModel.countDocuments({ status: 'published' }),
    CategoryModel.countDocuments(),
    UserModel.countDocuments({ status: { $ne: 'deleted' } }),
    listAuditLogs(10),
  ]);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Admin overview retrieved successfully',
    data: {
      stats: {
        guideCount,
        publishedGuideCount,
        categoryCount,
        userCount,
      },
      recentAuditLogs: auditLogs,
    },
  });
});
