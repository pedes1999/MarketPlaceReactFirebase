import { useState } from 'react'
import { toast } from 'react-toastify'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config'
import Oauth from '../components/Oauth'
function Signup() {
    //State for the visibility icon
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()
    //State to Hold the form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const { name, email, password } = formData

    //OnChange to instantly change the form data
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            //e.target.mail = mail, e.target.name:name 
            [e.target.id]: e.target.value
        }))
    }

    //on submit (createUserWith... is async) -> create a user 
    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const auth = getAuth()
            //returns user credentials
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)

            const user = userCredential.user
            updateProfile(auth.currentUser, {
                displayName: name
            })
            //copy form data to be passed to firestore database
            const formDataCopy = { ...formData }
            delete formDataCopy.password
            formDataCopy.timestamp = serverTimestamp()
            //set the formdata to the db
            await setDoc(doc(db, 'users', user.uid), formDataCopy)

            navigate('/')
        } catch (error) {
            toast.error('Something went wrong with registration')
        }

    }



    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">Welcome Back!</p>
                </header>

                <main>
                    <form onSubmit={onSubmit}>
                        <input type="text" className='nameInput' placeholder='Name' id='name' value={name} onChange={onChange} />
                        <input type="email" className='emailInput' placeholder='Email' id='email' value={email} onChange={onChange} />

                        <div className="passwordInputDiv">
                            <input type={showPassword ? 'text' : 'password'} className='passwordInput' placeholder='Password' id='password' value={password} onChange={onChange} />

                            <img className='showPassword' src={visibilityIcon} alt='show password' onClick={() => setShowPassword((prevState) => !prevState)} />
                        </div>


                        <div className="signUpBar">
                            <p className="signUpText">Sign Up</p>
                            <button className="signUpButton">
                                <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
                            </button>
                        </div>
                    </form>

                    <Oauth />

                    <Link to='/sign-in' className='registerLink'>
                        Sign In Instead
                    </Link>
                </main>
            </div>
        </>
    )
}

export default Signup