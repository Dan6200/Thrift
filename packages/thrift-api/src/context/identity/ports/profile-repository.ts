export type ProfileRepository = {
  getProfile(userId: string): Promise<unknown>
}
