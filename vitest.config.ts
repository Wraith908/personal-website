
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        include: [
            'src/**/*.test.ts',
            'src/**/*.test.tsx'
        ],
        environment: 'node',
        isolate: true,
        clearMocks: true,
        restoreMocks: true
    }
});
