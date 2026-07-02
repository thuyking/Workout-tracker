import mongoose from 'mongoose'

export const connectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return
  }

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error('MONGO_URI or MONGODB_URI is required in .env')
  }

  await mongoose.connect(mongoUri)
  console.log('MongoDB connected')
}
