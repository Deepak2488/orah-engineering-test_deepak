import { RolllStateType } from "shared/models/roll"

export interface Person {
  id: number
  first_name: string
  last_name: string
  photo_url?: string
  status: ItemType
}
type ItemType = RolllStateType | "all"


export const PersonHelper = {
  getFullName: (p: Person) => `${p.first_name} ${p.last_name}`,
}
