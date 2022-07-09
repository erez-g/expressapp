import React from 'react'
import ContentRow from '../components/ContentRow'

const Home = () => {
  return (
    <>
        <h1 id="mainHeader">Home</h1>
        <ContentRow
            title="Featured"
            type="albums"
        />
        <ContentRow
            title="Favorites"
            type="albums"
        />
    </>
  )
}

export default Home