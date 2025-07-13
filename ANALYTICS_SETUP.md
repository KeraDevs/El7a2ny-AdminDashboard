# Google Analytics Integration Setup Guide

This guide will help you set up Google Analytics 4 (GA4) integration for tracking users across Web, Android, and iOS platforms.

## Prerequisites

1. A Google Analytics 4 property
2. Web, Android, and iOS data streams configured in GA4
3. A Google Cloud project with Analytics Reporting API enabled
4. A service account with access to your GA4 property

## Step 1: Set Up Google Analytics 4

### Create a GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property or use an existing one
3. Note down your **Property ID** (format: 123456789)

### Configure Data Streams

1. In GA4 Admin, go to **Property > Data Streams**
2. Create three data streams:
   - **Web**: For your website/web app
   - **Android**: For your Android app
   - **iOS**: For your iOS app
3. Note down the **Measurement IDs** and **Stream IDs** for each platform

## Step 2: Set Up Google Cloud Project

### Enable Analytics Reporting API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Analytics Reporting API**
4. Enable the **Google Analytics Data API**

### Create a Service Account

1. Go to **IAM & Admin > Service Accounts**
2. Click **Create Service Account**
3. Give it a name like "GA4 Analytics Reader"
4. Click **Create and Continue**
5. Don't assign any roles yet, click **Done**
6. Click on the created service account
7. Go to **Keys** tab and click **Add Key > Create New Key**
8. Choose **JSON** format and download the key file
9. Save this file securely (don't commit it to git!)

## Step 3: Grant Analytics Access

1. In Google Analytics, go to **Admin > Property > Property Access Management**
2. Click **Add users**
3. Add your service account email (found in the JSON key file)
4. Give it **Viewer** permissions
5. Click **Add**

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in the following variables:

```env
# From GA4 Property Settings
GA_PROPERTY_ID=123456789

# From Web Data Stream
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GA_WEB_STREAM_ID=1234567890

# From Android Data Stream
NEXT_PUBLIC_ANDROID_PACKAGE_NAME=com.yourcompany.yourapp
NEXT_PUBLIC_GA_ANDROID_STREAM_ID=1234567891

# From iOS Data Stream
NEXT_PUBLIC_IOS_BUNDLE_ID=com.yourcompany.yourapp
NEXT_PUBLIC_GA_IOS_STREAM_ID=1234567892

# Path to your service account key file
GOOGLE_APPLICATION_CREDENTIALS=./path/to/your/service-account-key.json
```

## Step 5: Install Your Apps/Website Tracking

### Web Tracking (Google tag/gtag.js)

Add this to your website's `<head>` section:

```html
<!-- Google tag (gtag.js) -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>
```

### Android Tracking (Firebase SDK)

1. Add Firebase to your Android project
2. Configure GA4 in Firebase Console
3. Add the Firebase SDK to your app

### iOS Tracking (Firebase SDK)

1. Add Firebase to your iOS project
2. Configure GA4 in Firebase Console
3. Add the Firebase SDK to your app

## Step 6: Test the Integration

1. Start your Next.js application: `npm run dev`
2. Navigate to `/analytics`
3. Check if data is loading properly
4. Verify real-time data is updating

## Troubleshooting

### "Google Analytics not configured" Error

- Verify all environment variables are set correctly
- Make sure your service account key file path is correct
- Check that the service account has proper permissions

### "Authentication Error"

- Verify your service account key file is valid
- Make sure the service account email is added to your GA4 property
- Check that the Analytics Reporting API is enabled

### No Data Showing

- Make sure your apps/website are sending data to GA4
- Allow 24-48 hours for initial data to appear
- Check GA4 real-time reports to verify data is being collected

### Real-time Data Not Updating

- Real-time data refreshes every 30 seconds automatically
- Make sure you have active users on your platforms
- Check browser console for any JavaScript errors

## Data Refresh Intervals

- **Overview, Platform, Device Data**: Refreshes when you change date range or click refresh
- **Real-time Data**: Auto-refreshes every 30 seconds
- **Historical Data**: Updated when you change the date range

## Security Notes

1. Never commit your service account key file to version control
2. Use environment variables for all sensitive configuration
3. Restrict service account permissions to minimum required (Viewer only)
4. Consider using Google Cloud Secret Manager for production deployments

## Support

For Google Analytics setup issues, refer to:

- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [Google Analytics Data API Documentation](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Firebase Analytics Documentation](https://firebase.google.com/docs/analytics)
