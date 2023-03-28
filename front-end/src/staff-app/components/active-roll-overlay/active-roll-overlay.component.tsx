import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { rollcount } from "shared/models/rollcount"
import { Person } from "shared/models/person"
import { ActiveFilterAction } from "staff-app/components/roll-state/roll-state-list.component"
export type ActiveRollAction = "filter" | "exit"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: string) => void
  onFilterClick: (action: ActiveFilterAction, value?: string) => void
  message: string // change
  totalcount: rollcount[]
  studentdata: Person[] | undefined
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const { isActive, onItemClick, onFilterClick, message, totalcount, studentdata } = props
  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>{message}</div>
        <div>
          <RollStateList stateList={totalcount} onFilterClick={onFilterClick} />
          <div style={{ marginTop: Spacing.u6 }}>
            <Button color="inherit" onClick={() => onItemClick("exit")}>
              Exit
            </Button>
            <Link to="/staff/activity" state={{ data: studentdata }}>
              <Button color="inherit" style={{ marginLeft: Spacing.u2, color: "white" }} onClick={() => onItemClick("exit")}>
                Complete
              </Button>
            </Link>
          </div>
        </div>
      </S.Content>
    </S.Overlay>
  )
}

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}
