import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'
function Offers() {
    const [lastFetchedListing, setLastFetchedListing] = useState(null)
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)

    const params = useParams()

    useEffect(() => {
        const fetchListings = async () => {
            try {
                //Get Reference
                const listingsRef = collection(db, 'listings')

                //create a query
                const q = query(listingsRef, where('offer', '==', true), orderBy('timestamp', 'desc'), limit(10))

                //Execute query 
                const querySnap = await getDocs(q)
                //fetch Last visible
                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchedListing(lastVisible)
                //loop through query
                const listings = []
                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                setListings(listings)
                setLoading(false)
            } catch (error) {
                toast.error('Cound not fetch Listings')
            }
        }
        fetchListings()
    }, [])
    const onFetchMoreListings = async () => {
        try {
            //Get Reference
            const listingsRef = collection(db, 'listings')

            //create a query
            const q = query(listingsRef, where('offer', '==', true), orderBy('timestamp', 'desc'), startAfter(lastFetchedListing), limit(10))

            //Execute query 
            const querySnap = await getDocs(q)
            //fetched last visible listings
            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedListing(lastVisible)
            //loop through query
            const listings = []
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings((prevState) => [...prevState, ...listings])
            setLoading(false)
        } catch (error) {
            toast.error('Cound not fetch Listings')
        }
    }
    return (
        <div className='category'>
            <header className="pageHeader">
                Offers
            </header>

            {loading ? <Spinner /> : listings && listings.length > 0 ?
                <>
                    <main>
                        <ul className="categoryListings">{listings.map((listing) => (
                            <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
                        ))}
                        </ul>
                    </main>
                    <br />
                    <br />
                    <br />
                    {lastFetchedListing && (
                        <p className="loadMore" onClick={onFetchMoreListings}>Load More</p>
                    )}
                </> : <p>There are no current Offers</p>}
        </div>
    )
}

export default Offers