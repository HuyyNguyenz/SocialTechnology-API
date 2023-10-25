export interface FriendType {
  id?: string
  status?: FriendStatus
  friendId?: number
  userId?: number
}

export enum FriendStatus {
  PENDING = 'pending',
  ACCEPT = 'accept'
}
