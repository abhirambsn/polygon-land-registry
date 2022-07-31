import React, { useContext, useEffect } from 'react'
import { LRContext } from '../context/LRContext'

function OwnedAssetsPage() {
    const {getOwnedLands, isAuthenticated} = useContext(LRContext);
    useEffect(() => {
        ;(async () => {
            if (!isAuthenticated) return;
            console.log(await getOwnedLands());
        })();
    }, [isAuthenticated])
  return (
    <div>OwnedAssetsPage</div>
  )
}

export default OwnedAssetsPage