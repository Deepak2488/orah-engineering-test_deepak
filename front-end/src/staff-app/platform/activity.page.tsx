import React from "react"
import { useLocation } from "react-router-dom"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { RollStateSwitcher } from "staff-app/components/roll-state/roll-state-switcher.component"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"

interface Props {
  location?: any
}

export const ActivityPage: React.FC<Props> = (props) => {
  const location = useLocation()
  console.log(location, " useLocation Hook")
  const ndata = location.state?.data
  console.log(ndata)
  return (
    <S.Container>
      <h1>Activity Page</h1>
      {ndata.map((el) => (
        <StudentListTile key={el.id} id={el.id} student={el} isRollMode={true} />
      ))}
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
