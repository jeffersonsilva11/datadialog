import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { AnalyticsAdminServiceClient } from "@google-analytics/admin";
import { OAuth2Client } from "google-auth-library";

export class GoogleAnalyticsClient {
    private auth: OAuth2Client;

    constructor(accessToken: string, refreshToken?: string | null) {
        console.log("Initializing GoogleAnalyticsClient");
        console.log("Has Access Token:", !!accessToken);
        console.log("Has Refresh Token:", !!refreshToken);
        console.log("Client ID present:", !!process.env.GOOGLE_CLIENT_ID);
        console.log("Client Secret present:", !!process.env.GOOGLE_CLIENT_SECRET);

        this.auth = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );

        this.auth.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken || undefined,
            // expiry_date?
        });
    }

    async listProperties() {
        try {
            // Ensure token is valid/refreshed
            const { token } = await this.auth.getAccessToken();
            console.log("Token refreshed/verified:", !!token);

            // Test auth headers generation
            const headers = await this.auth.getRequestHeaders();
            console.log("Successfully generated auth headers. Keys:", Object.keys(headers));
            const authHeader = (headers as any).Authorization;
            if (authHeader) {
                console.log("Authorization header starts with:", authHeader.substring(0, 10) + "...");
            }
        } catch (e) {
            console.error("Failed to generate auth headers or refresh token:", e);
        }

        const analyticsAdmin = new AnalyticsAdminServiceClient({
            authClient: this.auth,
            projectId: process.env.GOOGLE_PROJECT_ID, // Optional but good practice
            fallback: 'rest', // Try forcing REST to avoid gRPC auth issues
        });

        try {
            // List all account summaries to get properties
            // Note: This requires the analytics.readonly scope
            const [response] = await analyticsAdmin.listAccountSummaries({
                pageSize: 200,
            });

            const properties = [];

            for (const accountSummary of response) {
                if (accountSummary.propertySummaries) {
                    for (const property of accountSummary.propertySummaries) {
                        properties.push({
                            name: property.property, // Format: properties/12345
                            displayName: property.displayName,
                            propertyType: property.propertyType,
                        });
                    }
                }
            }

            return { content: properties };
        } catch (error) {
            console.error("Error listing properties:", error);
            throw error;
        }
    }

    async runReport(propertyId: string, params: any) {
        // Ensure token is valid
        await this.auth.getAccessToken();

        const analyticsData = new BetaAnalyticsDataClient({
            authClient: this.auth,
            fallback: 'rest',
        });

        try {
            const [response] = await analyticsData.runReport({
                property: `properties/${propertyId}`,
                ...params,
            });

            return response;
        } catch (error) {
            console.error("Error running report:", error);
            throw error;
        }
    }
}
