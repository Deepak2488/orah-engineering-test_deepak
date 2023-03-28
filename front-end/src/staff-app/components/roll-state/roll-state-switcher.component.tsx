import React, { useState } from "react"
import { RolllStateType } from "shared/models/roll"
import { rollcount } from "shared/models/rollcount"
import { Person } from "shared/models/person"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"

interface Props {
  id: number
  status?: string
  dataState?: { students: Person[] }
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void
  rollcounts?: rollcount[]
  onChangeCount?: (a: any) => void
}

export const RollStateSwitcher: React.FC<Props> = ({ id, status, dataState, initialState = "unmark", size = 40, onStateChange, rollcounts, onChangeCount }) => {
  const [rollState, setRollState] = useState(initialState)
  function nextState() {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const updateCount = (arr, n, p) => {
    var indexp = arr.findIndex((el) => el.type === p)
    var indexn = arr.findIndex((el) => el.type === n)
    if (indexp > -1) {
      arr[indexp].count -= 1
      arr[indexn].count += 1
    } else {
      arr[indexn].count += 1
    }
    return arr
  }

  const updateState = (key, arr, status) => {
    const update_arr = arr.map((el) => {
      if (el.id === key) {
        el.status = status
      }
      return el
    })
    return update_arr
  }
  const onClick = (key: number) => {
    console.log(key)
    console.log("previous state: ", rollState)
    const next = nextState()
    console.log("current state: ", next)
    const prop_arr = dataState?.students
    const newcount = [...updateCount(rollcounts, next, rollState)]
    if (dataState?.students != undefined) {
      dataState.students = [...updateState(key, prop_arr, next)]
    }
    onChangeCount(newcount)
    setRollState(next)
    if (onStateChange) {
      onStateChange(next)
    }
    console.log(rollState)
  }

  return <RollStateIcon status={status} type={rollState} size={size} onClick={() => onClick(id)} />
}
