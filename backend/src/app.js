const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const { env } = require("./config/env");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");
const dashboardRoutes = require("./features/dashboard/dashboard.routes");
const authRoutes = require("./features/auth/auth.routes");
const settingsRoutes = require("./features/settings/settings.routes");
const bannersRoutes = require("./features/banners/banners.routes");
const contactRoutes = require("./features/contact/contact.routes");
const joinRequestsRoutes = require("./features/joinRequests/joinRequests.routes");
const statsRoutes = require("./features/stats/stats.routes");
const blogsRoutes = require("./features/blogs/blogs.routes");
const studiesRoutes = require("./features/studies/studies.routes");
const aboutFeaturesRoutes = require("./features/aboutFeatures/aboutFeatures.routes");
const booksRoutes = require("./features/books/books.routes");
const usersRoutes = require("./features/users/users.routes");
const subscribersRoutes = require("./features/subscribers/subscribers.routes");
const subscriptionsRoutes = require("./features/subscriptions/subscriptions.routes");
const contentAccessRoutes = require("./features/contentAccess/contentAccess.routes");
const writerUpgradesRoutes = require("./features/writerUpgrades/writerUpgrades.routes");
const favoritesRoutes = require("./features/favorites/favorites.routes");
const newsletterRoutes = require("./features/newsletter/newsletter.routes");
const bookPricingTiersRoutes = require("./features/bookPricingTiers/bookPricingTiers.routes");
const newsTickerRoutes = require("./features/newsTicker/newsTicker.routes");
const siteAdsRoutes = require("./features/siteAds/siteAds.routes");
const writerTrialRoutes = require("./features/writerTrial/writerTrial.routes");
const contentTrialsRoutes = require("./features/contentTrials/contentTrials.routes");

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

app.use("/api", dashboardRoutes);
app.use("/api", authRoutes);
app.use("/api", settingsRoutes.publicRouter);
app.use("/api", bannersRoutes.publicRouter);
app.use("/api", contactRoutes.publicRouter);
app.use("/api", joinRequestsRoutes.publicRouter);
app.use("/api", statsRoutes.publicRouter);
app.use("/api", blogsRoutes.publicRouter);
app.use("/api", studiesRoutes.publicRouter);
app.use("/api", aboutFeaturesRoutes.publicRouter);
app.use("/api", booksRoutes.publicRouter);
app.use("/api", subscribersRoutes.publicRouter);
app.use("/api", subscriptionsRoutes.publicRouter);
app.use("/api", contentAccessRoutes.publicRouter);
app.use("/api", writerUpgradesRoutes.publicRouter);
app.use("/api", favoritesRoutes.publicRouter);
app.use("/api", newsletterRoutes.publicRouter);
app.use("/api", bookPricingTiersRoutes.publicRouter);
app.use("/api", newsTickerRoutes.publicRouter);
app.use("/api", siteAdsRoutes.publicRouter);
app.use("/api", writerTrialRoutes.publicRouter);
app.use("/api", contentTrialsRoutes.publicRouter);

app.use("/api/admin", settingsRoutes.adminRouter);
app.use("/api/admin", bannersRoutes.adminRouter);
app.use("/api/admin", contactRoutes.adminRouter);
app.use("/api/admin", joinRequestsRoutes.adminRouter);
app.use("/api/admin", blogsRoutes.adminRouter);
app.use("/api/admin", studiesRoutes.adminRouter);
app.use("/api/admin", aboutFeaturesRoutes.adminRouter);
app.use("/api/admin", booksRoutes.adminRouter);
app.use("/api/admin", usersRoutes.adminRouter);
app.use("/api/admin", subscriptionsRoutes.adminRouter);
app.use("/api/admin", contentAccessRoutes.adminRouter);
app.use("/api/admin", writerUpgradesRoutes.adminRouter);
app.use("/api/admin", bookPricingTiersRoutes.adminRouter);
app.use("/api/admin", newsTickerRoutes.adminRouter);
app.use("/api/admin", siteAdsRoutes.adminRouter);
app.use("/api/admin", writerTrialRoutes.adminRouter);
app.use("/api/admin", contentTrialsRoutes.adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app };
