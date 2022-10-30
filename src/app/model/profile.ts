export interface Profile {
    bio: string,
    userId: string,
    userName: string,
    profilePicture: string | undefined,
    comments: number | undefined,
    collect: number | undefined,
    mirrors: number | undefined,
    follower: number | undefined,
    following: number | undefined,
    post: number | undefined,
    publications: number | undefined
}