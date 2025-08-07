import { Activity, ActivityType } from '@prisma/client'
import { formatDate } from '../../utils/helper'

const ACTIVITY_MESSAGES: Record<ActivityType, (activity: Activity) => string> =
  {
    [ActivityType.BRAND_CREATED]: activity =>
      `• Brand "${activity.entityName}" was created at ${formatDate(activity.createdAt)}`,
    [ActivityType.PRODUCT_ADDED]: activity =>
      `• Product "${activity.entityName}" was added at ${formatDate(activity.createdAt)}`,
    [ActivityType.SELLER_REGISTERED]: activity =>
      `• Seller "${activity.entityName}" registered at ${formatDate(activity.createdAt)}`,
    [ActivityType.PRODUCT_UPDATED]: activity =>
      `• Product "${activity.entityName}" was updated at ${formatDate(activity.createdAt)}`,
  } as const

/**
 * Converts an array of activities to human-readable strings
 * @param activities - Array of Activity objects to stringify
 * @returns Array of formatted activity strings
 */
export function stringifyActivities(activities: Activity[]): string[] {
  return activities.map(activity => {
    const messageFormatter = ACTIVITY_MESSAGES[activity.type]

    if (!messageFormatter) {
      console.warn(`Unknown activity type: ${activity.type}`)
      return `Unknown activity "${activity.entityName}" at ${formatDate(activity.createdAt)}`
    }

    return messageFormatter(activity)
  })
}
