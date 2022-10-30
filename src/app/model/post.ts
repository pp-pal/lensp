export interface Post {
    content: string,
    userId: string,
    userName: string,
    postId: string,
    profilePicture: string | undefined,
    comments: number | undefined,
    collect: number | undefined,
    mirrors: number | undefined
}