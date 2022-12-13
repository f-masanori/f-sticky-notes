/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import React from 'react'
import ClickAwayListener from 'react-click-away-listener'
import { BsThreeDots } from 'react-icons/bs'
import { HiOutlinePlusCircle } from 'react-icons/hi'

import { useFloating, shift, offset, flip } from '@floating-ui/react-dom'

export type SidebarProps = {
  createGroup: () => void
  isSidebarOpen
  setIsSidebarOpen
  SNGroupList: {
    id: string
    label: string
  }[]
  currentGroup: {
    id: string
    label: string
  }
  handleGroupLabel: (a: { id: string; label: string }) => void
  changeGroupName: (a: { id: string; label: string }) => void
  handleGroupNameOnBlur
}

const tagliteral = css`
  &:hover {
    button {
      visibility: visible;
    }
  }
`

export const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  SNGroupList,
  createGroup,
  currentGroup,
  handleGroupLabel,
  changeGroupName,
  handleGroupNameOnBlur,
}: SidebarProps) => {
  const [editingGroupID, setEditingGroupID] = React.useState('')
  const setEditing = (groupID: string) => setEditingGroupID(groupID)
  const clearEditing = () => setEditingGroupID('')
  const groupNameInputRef = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (editingGroupID !== '') groupNameInputRef.current.focus()
  }, [editingGroupID])
  return (
    <>
      {isSidebarOpen ? (
        <div className='w-64 h-full' style={{ zIndex: '9999999' }} aria-label='Sidebar'>
          <div className='overflow-y-auto py-1 px-1 ml-1 bg-gray-50 rounded dark:bg-gray-800'>
            <ul className='space-y-1'>
              {SNGroupList.map((v) => {
                return (
                  <li
                    key={v.id}
                    className={
                      v.id === currentGroup.id
                        ? 'bg-amber-200 list-none'
                        : 'hover:bg-amber-100 list-none'
                    }
                  >
                    {editingGroupID === v.id ? (
                      <ClickAwayListener onClickAway={clearEditing}>
                        <input
                          className={'mt-1 mb-1 ml-2 '}
                          value={v.label}
                          onChange={(e) =>
                            changeGroupName({ id: v.id, label: e.currentTarget.value })
                          }
                          onBlur={() => {
                            handleGroupNameOnBlur({ groupID: v.id, groupLabel: v.label })
                          }}
                          ref={groupNameInputRef}
                        />
                      </ClickAwayListener>
                    ) : (
                      <div css={tagliteral} className='flex justify-between'>
                        <a
                          onClick={() => handleGroupLabel(v)}
                          href='#'
                          className={`flex items-center p-1 text-base font-normal text-gray-900 rounded-lg dark:text-white 
                      dark:hover:bg-gray-700 flex-grow`}
                        >
                          <span className=''>{v.label}</span>
                        </a>
                        <SettingButton
                          groupID={v.id}
                          renameBtnHandler={(gid) => {
                            setEditing(gid)
                          }}
                        />
                      </div>
                    )}
                  </li>
                )
              })}
              <li className={'p-0 list-none'}>
                <button
                  className='flex justify-items-center items-center  w-full h-6 bg-stone-200 
                   hover:bg-amber-100'
                  onClick={createGroup}
                >
                  <div className='flex justify-center items-center  w-full'>
                    <HiOutlinePlusCircle
                      size={20}
                      className='text-yellow-700 hover:text-amber-700'
                    />
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          className='flex text-4xl text-white items-center cursor-pointer fixed right-10 top-6 z-50'
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          x
        </button>
      )}
    </>
  )
}

const SettingButton = ({
  groupID,
  renameBtnHandler,
}: {
  renameBtnHandler: (groupID: string) => void
  groupID: string
}) => {
  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'right',
    middleware: [offset(4), flip(), shift({ padding: 5 })],
  })
  const [isShow, setIsShow] = React.useState(false)
  const handleClickAway = () => {
    setIsShow(false)
  }
  return (
    <>
      <button
        onClick={() => !isShow && setIsShow(true)}
        ref={reference}
        className='invisible px-1 hover:bg-slate-200 my-1 mr-1 rounded-lg'
      >
        <BsThreeDots size={18} color='grey' />
      </button>
      {isShow && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <div
            id='tooltip'
            ref={floating}
            style={{ top: y ?? 0, left: x ?? 0, position: strategy, zIndex: 90000 }}
          >
            <SettingArea renameBtnHandler={renameBtnHandler} groupID={groupID} />
          </div>
        </ClickAwayListener>
      )}
    </>
  )
}

const SettingArea = ({
  renameBtnHandler,
  groupID,
}: {
  renameBtnHandler: (groupID: string) => void
  groupID: string
}) => {
  return (
    <div className='bg-gray-300 hover:bg-gray-500 text-white font-bold p-2'>
      <button className=' px-1 hover:bg-slate-200 ' onClick={() => renameBtnHandler(groupID)}>
        Rename
      </button>
    </div>
  )
}
