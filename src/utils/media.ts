const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'svg']
const VIDEO_EXTS = ['mp4', 'webm', 'ogg', 'wav', 'falc', 'acc']

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Media {
  public static checkIsImg(url: string): boolean {
    return /\.(png|jpe?g|gif|svg)(\?.*)?$/i.test(url)
  }

  public static checkIsVideo(url: string): boolean {
    return /\.(mp4|webm|ogg|wav|flac|aac)(\?.*)?$/i.test(url)
  }

  public static get imgAccept(): string {
    return IMAGE_EXTS.map((ext) => `.${ext}`).join(',')
  }

  public static get videoAccept(): string {
    return VIDEO_EXTS.map((ext) => `.${ext}`).join(',')
  }
}
