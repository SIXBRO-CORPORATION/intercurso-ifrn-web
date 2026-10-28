const SAFE_PHOTO_SRC = /^(https?:\/\/|\/(?![/\\]))/

export function resolvePhotoSrc(photo: string | null | undefined) {
    const value = photo?.trim()
    if (!value) return null
    return SAFE_PHOTO_SRC.test(value) ? value : null
}
