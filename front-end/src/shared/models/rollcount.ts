import { RolllStateType } from "shared/models/roll"

export interface rollcount {
    count: number
    type: ItemType
  }

  type ItemType = RolllStateType | "all"
