import React, { useState, createContext, useContext } from 'react'
import { initialResources } from '../data/resources'

const ResourceContext = createContext(undefined)

export const ResourceProvider = ({ children }) => {
  const [resources, setResources] = useState(initialResources)

  const addResource = (resourceData) => {
    const newId = `RES-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')}`

    setResources([
      ...resources,
      {
        ...resourceData,
        id: newId,
      },
    ])
  }

  const updateResource = (id, resourceData) => {
    setResources(
      resources.map((r) =>
        r.id === id
          ? {
              ...resourceData,
              id,
            }
          : r,
      ),
    )
  }

  const deleteResource = (id) => {
    setResources(resources.filter((r) => r.id !== id))
  }

  return (
    <ResourceContext.Provider
      value={{
        resources,
        addResource,
        updateResource,
        deleteResource,
      }}
    >
      {children}
    </ResourceContext.Provider>
  )
}

export const useResources = () => {
  const context = useContext(ResourceContext)
  if (context === undefined) {
    throw new Error('useResources must be used within a ResourceProvider')
  }
  return context
}
