import { TStickyNote } from '@/components/SNboard/models'

type GetSNProps = {
  uid: string
  token: string
}

type CreateSNProps = {
  uid: string
  st: TStickyNote
  token: string
}

export const getSN = async ({ uid, token }: GetSNProps) => {
  // const res = await fetch('https://f-sticky-notes.work/api/stickyNote', {
  const res = await fetch('http://localhost:8080/stickyNote', {
    method: 'GET',
    mode: 'cors', // no-cors, *cors, same-origin
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer',
    headers: {
      'Content-Type': 'application/json',
      uid: uid,
      token: token,
    },
  })
  const j = await res.json()
  console.log(j)
  return j.result
}

export const createSN = async ({ uid, st, token }: CreateSNProps) => {
  const res = await fetch('http://localhost:8080/stickyNote', {
    method: 'POST',
    mode: 'cors', // no-cors, *cors, same-origin
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    headers: {
      'Content-Type': 'application/json',
      uid: uid,
      token: token,
    },
    body: JSON.stringify(st),
  })
  const j = await res.json()
}

export const updateSN = async ({ uid, st, token }: CreateSNProps) => {
  const res = await fetch('http://localhost:8080/stickyNote', {
    method: 'PUT',
    mode: 'cors', // no-cors, *cors, same-origin
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    headers: {
      'Content-Type': 'application/json',
      uid: uid,
      token: token,
    },
    body: JSON.stringify(st),
  })
  const j = await res.json()
}

type GetMySNProps = {
  uid: string
}

type getGroupRes = {
  id: string
  uid: string
  label: string
}[]
export const getGroup = async ({ uid, token }) => {
  const res = await fetch('http://localhost:8080/stickyNoteGroups', {
    method: 'GET',
    mode: 'cors', // no-cors, *cors, same-origin
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer',
    headers: {
      'Content-Type': 'application/json',
      uid: uid,
      token: token,
    },
  })
  const j = await res.json()
  console.log(j)
  const result: getGroupRes = j.result
  return result
}

export const createGroup = async ({ uid, token }) => {
  const res = await fetch('http://localhost:8080/stickyNoteGroups', {
    method: 'POST',
    mode: 'cors', // no-cors, *cors, same-origin
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    headers: {
      'Content-Type': 'application/json',
      uid: uid,
      token: token,
    },
  })
  const j = await res.json()
  return j
}

type UpdateSNPGrouprops = {
  uid: string
  token: string
  groupID: string
  groupLabel: string
}

export const updateGroup = async ({ uid, token, groupID, groupLabel }: UpdateSNPGrouprops) => {
  const res = await fetch('http://localhost:8080/stickyNoteGroups', {
    method: 'PUT',
    mode: 'cors', // no-cors, *cors, same-origin
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    headers: {
      'Content-Type': 'application/json',
      uid: uid,
      token: token,
    },
    body: JSON.stringify({ groupID, label: groupLabel }),
  })
  const j = await res.json()
}
