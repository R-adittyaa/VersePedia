import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Paksa baca dari process.env, jangan pakai env() helper
    url: process.env.DATABASE_URL!,
  },
})