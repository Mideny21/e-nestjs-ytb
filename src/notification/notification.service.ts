import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleAuth } from 'google-auth-library';
import { readFileSync } from 'fs';
import { join } from 'path';
import axios from 'axios';

@Injectable()
export class NotificationService {
    private readonly PROJECT_ID: string;
    private readonly SCOPES = ['https://www.googleapis.com/auth/firebase.messaging'];
    private readonly MESSAGING_URL: string;
    private readonly keyFilePath: string;

    constructor(private readonly configService: ConfigService) {
        // Resolve the path from env
        this.keyFilePath = join(
            process.cwd(),
            this.configService.get<string>('appConfig.firebaseServiceAccount'),
        );

        // Load the JSON from the file
        const key = JSON.parse(readFileSync(this.keyFilePath, 'utf8'));

        if (!key.project_id) {
            throw new Error('Invalid Firebase service account file');
        }

        this.PROJECT_ID = key.project_id;
        this.MESSAGING_URL = `https://fcm.googleapis.com/v1/projects/${this.PROJECT_ID}/messages:send`;
    }

    private async getAccessToken(): Promise<string> {
        const auth = new GoogleAuth({
            keyFile: this.keyFilePath,
            scopes: this.SCOPES,
        });

        const client = await auth.getClient();
        const accessTokenResponse = await client.getAccessToken();

        if (!accessTokenResponse.token) {
            throw new Error('Failed to get access token');
        }

        return accessTokenResponse.token;
    }

    async sendNotification(
        token: string,
        title: string,
        body: string,
        data?: Record<string, string>,
    ) {
        const accessToken = await this.getAccessToken();

        const message = {
            message: {
                token,
                notification: { title, body },
                data: data || {},
            },
        };

        const response = await axios.post(this.MESSAGING_URL, message, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    }
}
