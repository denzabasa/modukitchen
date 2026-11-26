import sharp from 'sharp'
import { randomUUID } from 'node:crypto'

export async function createTestImage(
  width = 2400,
  height = 1600,
) {
  const data = await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: '#B99B7B',
    },
  })
    .jpeg({
      quality: 80,
    })
    .toBuffer()

  return {
    data,
    mimetype: 'image/jpeg',
    name: `test-media-${randomUUID()}.jpg`,
    size: data.length,
  }
}