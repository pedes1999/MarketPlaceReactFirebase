import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Spinner from './Spinner';
function Slider() {
    const [loading, setLoading] = useState(true)
    const [listings, setListing] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {

        const fetchListings = async () => {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(3))

            const querySnap = await getDocs(q)

            let listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            console.log(listings)
            setListing(listings)
            setLoading(false)
        }
        fetchListings()
    }, [])

    if (loading) {
        return <Spinner />
    }

    if (listings.length === 0) {
        return <></>
    }
    return listings && (
        <>
            <p className="exploreHeading">Recommended</p>

            <Swiper slidesPerView={1} pagination={{ clickable: true }} >
                {listings.map(({ data, id }) => (
                    <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                        <div className="swiperSlideDiv"
                            style={{
                                background: `url(${data.imgUrls[0]}) center no-repeat`,
                                backgroundSize: 'cover',
                                width: '100%',
                                height: '40rem'
                            }}
                        >
                            <p className="swiperSlideText">{data.name}</p>
                            <p className="swiperSlidePrice">${data.discountedPrice ?? data.regularPrice}
                                {data.type === 'rent' && ' / month '}
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}

export default Slider