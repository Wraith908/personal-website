
import { defineConfig, devices } from '@playwright/test';

const remoteURL = process.env.TEST_BASE_URL;

export default defineConfig({
    testDir: './tests/browser',
    fullyParallel: false,
    workers: 1,
    retries: 0,
    timeout: 30000,
    globalTimeout: 300000,

    reporter: [
        ['list'],
        ['html', { open: 'never' }]
    ],

    use: {
        baseURL: remoteURL ??
            'http://127.0.0.1:4173',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
        video: 'off'
    },

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome']
            }
        },
        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari']
            }
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox']
            }
        }
    ],

    webServer: remoteURL ? undefined : {
        command:
            'npm run preview -- --host 127.0.0.1 --strictPort',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: false,
        timeout: 30000
    }
});
