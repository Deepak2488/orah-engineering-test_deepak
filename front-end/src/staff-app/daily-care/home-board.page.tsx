import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { rollcount } from "shared/models/rollcount"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { ActiveFilterAction } from "staff-app/components/roll-state/roll-state-list.component"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [filterType, setFilterType] = useState("none")
  const [sort, setSort] = useState(0)
  const [search, setSearch] = useState("")
  const [toggle, setToggle] = useState("Name")
  const [searchData, setSearchData] = useState<Person[] | undefined>([])
  const [filterData, setFilterData] = useState<Person[] | undefined>([])
  const [sortData, setSortData] = useState<Person[] | undefined>([])
  const [modData, setModData] = useState<{ students: Person[] }>()
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [rollCount, setRollCount] = useState<rollcount[]>([
    { type: "all", count: 0 },
    { type: "present", count: 0 },
    { type: "late", count: 0 },
    { type: "absent", count: 0 },
  ])
  const [msg, setMsg] = useState<string>("Class Attendance")

  const getFilterData = async () => {
    const d: Person[] | undefined = await data?.students?.filter((e: any) => {
      return e?.status === filterType
    })
    setFilterData(d)
  }

  const getSearchData = async () => {
    const d: Person[] | undefined = await data?.students?.filter((e: any) => {
      return e.first_name.toLowerCase().includes(search) || e.last_name.toLowerCase().includes(search)
    })
    setSearchData(d)
    console.log(d)
  }

  const getIncData = async () => {
    //sort by increa
    const newarr = [
      data?.students?.sort((a, b) => (a.first_name.toLowerCase() > b.first_name.toLowerCase() ? 1 : b.first_name.toLowerCase() > a.first_name.toLowerCase() ? -1 : 0)),
    ]
    //console.log(newarr)
    newarr.pop()
    setSortData(newarr)
  }

  const getDescData = async () => {
    // sort by desc
    const newarr = [data?.students?.sort((a, b) => (a.last_name.toLowerCase() > b.last_name.toLowerCase() ? -1 : b.last_name.toLowerCase() > a.last_name.toLowerCase() ? 1 : 0))]
    //console.log(newarr);
    newarr.pop()
    setSortData(newarr)
  }

  useEffect(() => {
    async function fetch() {
      await getStudents()
    }
    if (search === "" && (filterType === "none" || filterType === "all") && sort === 0) {
      console.log("fetch")
      fetch()
      setFilterData([])
      setSearchData([])
    } else if (search !== "") {
      getSearchData()
    } else if (filterType !== "none" && filterType !== "all") {
      getFilterData()
    } else if (sort === 1) {
      getIncData()
    } else if (sort === 2) {
      getDescData()
    }
    setModData(data)
  }, [modData, search, filterType, sort])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
    if (action === "sort" && sort === 0) {
      setToggle("First Name")
      setSort((prev) => prev + 1) // sort = 2, ascenddding;   sort = 3, descending
    }

    if (action === "sort" && sort === 1) {
      setToggle("Last Name")
      setSort((prev) => prev + 1) // sort = 2, ascenddding;   sort = 3, descending
    }

    if (action === "sort" && sort === 2) {
      setToggle("Name")
      setSort(0) // sort = 1 normal
    }
  }
  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  const onFilterAction = (action: ActiveFilterAction) => {
    console.log("in home action: ", action)
    setFilterType(action)
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar setSearch={setSearch} d={data} onItemClick={onToolbarAction} heading={toggle} />
        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}
        {loadState === "loaded" && search === "" && (filterType === "none" || filterType === "all") && data?.students && (
          <>
            {data?.students.map((s) => (
              <div>
                <StudentListTile key={s.id} id={s.id} isRollMode={isRollMode} dataState={data} student={s} count={rollCount} ChangeCount={(m: any[]) => setRollCount(m)} />
              </div>
            ))}
          </>
        )}

        {loadState === "loaded" && search !== "" && filterType === "none" && searchData && data?.students && (
          <>
            {searchData.map((s) => (
              <div>
                <StudentListTile key={s.id} id={s.id} isRollMode={isRollMode} student={s} />
              </div>
            ))}
          </>
        )}

        {loadState === "loaded" && filterType !== "none" && filterData && (
          <>
            {filterData.map((s) => (
              <div>
                <StudentListTile key={s.id} id={s.id} isRollMode={isRollMode} student={s} />
              </div>
            ))}
          </>
        )}

        {loadState === "loaded" && sort !== 0 && sortData && (
          <>
            {sortData.map((s) => (
              <div>
                <StudentListTile key={s.id} id={s.id} isRollMode={isRollMode} student={s} />
              </div>
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} onFilterClick={onFilterAction} message={msg} totalcount={rollCount} studentdata={data?.students} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  d: any
  setSearch: any
  heading: string
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, d, setSearch, heading } = props
  const handleSearch = (e: any) => {
    setSearch(e.target.value)
  }
  return (
    <S.ToolbarContainer>
      <S.Button onClick={() => onItemClick("sort")}>{heading}</S.Button>
      <div>
        <input onChange={(e) => handleSearch(e)} placeholder="Search Students" />
      </div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
