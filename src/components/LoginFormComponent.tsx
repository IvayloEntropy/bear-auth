import React, {
  useRef,
  useState,
  ChangeEvent,
  SyntheticEvent,
  useEffect,
} from 'react';
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
  UseRiveParameters,
  RiveState,
  StateMachineInput,
} from 'rive-react';
import './LoginFormComponent.css';

const STATE_MACHINE_NAME = 'Login Machine';
const LOGIN_PASSWORD = 'teddy';
const LOGIN_TEXT = 'Continue';

/**
 * Use case for a simple login experience that incorporates a Rive asset with a
 * state machine to coordinate user interaction with a form
 * @param riveProps
 */
const LoginFormComponent = (riveProps: UseRiveParameters = {}) => {
  const { rive: riveInstance, RiveComponent }: RiveState = useRive({
    src: 'login-teddy.riv',
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    ...riveProps,
  });
  const [userValue, setUserValue] = useState('');
  const [passValue, setPassValue] = useState('');
  const [inputLookMultiplier, setInputLookMultiplier] = useState(0);
  const [loginButtonText, setLoginButtonText] = useState(LOGIN_TEXT);
  const inputRef = useRef(null);
  const [ isValidUserName, setIsValidUsername ] = useState(false);
  const [ isValidPassword, setIsValidPassword ] = useState(false);
  const [ initialDisabled, setInitialDisabled ] = useState(true);

  const isCheckingInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    'isChecking'
  );
  
  const numLookInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    'numLook'
  );
  const trigSuccessInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    'trigSuccess'
  );
  const trigFailInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    'trigFail'
  );
  const isHandsUpInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    'isHandsUp'
  );

  // Divide the input width by the max value the state machine looks for in numLook.
  // This gets us a multiplier we can apply for each character typed in the input
  // to help Teddy track progress along the input line
  useEffect(() => {
    if (inputRef?.current && !inputLookMultiplier) {
      setInputLookMultiplier(
        (inputRef.current as HTMLInputElement).offsetWidth / 100
      );
    }
  }, [inputRef]);

  // As the user types in the username box, update the numLook value to let Teddy know
  // where to look to according to the state machine
  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setUserValue(newVal);
    if (!isCheckingInput!.value) {
      isCheckingInput!.value = true;
    }
    const numChars = newVal.length;
    numLookInput!.value = numChars * inputLookMultiplier;

  

  };

  // Start Teddy looking in the correct spot along the username input
  const onUsernameFocus = () => {
    isCheckingInput!.value = true;
    if (numLookInput!.value !== userValue.length * inputLookMultiplier) {
      numLookInput!.value = userValue.length * inputLookMultiplier;
    }
  };

  // When submitting, simulate password validation checking and trigger the appropriate input from the
  // state machine
  const onSubmit = (e: SyntheticEvent) => {
    setLoginButtonText('Checking...');
    setTimeout(() => {
      setLoginButtonText(LOGIN_TEXT);
      passValue === LOGIN_PASSWORD
        ? trigSuccessInput!.fire()
        : trigFailInput!.fire();
    }, 1500);
    e.preventDefault();
    return false;
  };

  return (
    <div className="login-form-component-root">
      <div className="login-form-wrapper">
        <div className="rive-wrapper">
          <RiveComponent className="rive-container" />
        </div>
        <div className="">
        <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center mx-auto  lg:py-0">
    
          <div className="w-full coolCard bg-white rounded-lg  md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
             <p style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
              Meet your new authentication friend 
              </p> 
             <p style={{ fontSize: '14px', fontWeight: '500', color: '#727374', marginTop: '8px' }}>
              If you want to successfully continue add any email and password teddy
              </p> 

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label style={{ color: '#262626' }} className="block mb-2 text-sm font-medium dark:text-white">
                    Your email
                  </label>
                  <input
                    style={{ height: '50px', marginBottom: '2px' }}
                    className={`${isValidUserName ? '!border-red-500 inputCustomError' : 'hover:border-[#1ebd75] focus:ring-[#1ebd75] focus:border-[#1ebd75] inputCustom' } border border-gray-300  text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5`}
                    placeholder="name@company.com"
                    required=""
                    onFocus={onUsernameFocus}
                    value={userValue}
                    onChange={onUsernameChange}
                    onBlur={(e) => {
                      isCheckingInput!.value = false
                      const emailValidation =
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    
                
                    if (emailValidation.test(String(e.target.value).toLowerCase())) {
                      setIsValidUsername(false)
                      setInitialDisabled(false)
                    } else {
                      setIsValidUsername(true)
                      setInitialDisabled(false) 
                    }
                    }}
                    ref={inputRef}
                  />

                 
              
                  {isValidUserName && 
                  <span  style={{ color: '#ff4d4f', fontSize: '14px' }}>Please type in a valid email!</span>
                }
                </div>
                <div>
                  <label style={{ color: '#262626' }} className="block mb-2 text-sm font-medium dark:text-white">
                    Password
                  </label>
                  <input
                    style={{ height: '50px',  marginBottom: '2px' }}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className={`${isValidPassword ? '!border-red-500 inputCustomError' : 'hover:border-[#1ebd75] focus:ring-[#1ebd75] focus:border-[#1ebd75] inputCustom' } border border-gray-300  text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5`}
                    required=""
                    value={passValue}
                    onFocus={() => (isHandsUpInput!.value = true)}
                    onBlur={(e) =>{
                      isHandsUpInput!.value = false
                      
                      if (e.target.value !== '') {
                        setIsValidPassword(false)
                        setInitialDisabled(false)
                      } else {
                        setIsValidPassword(true)
                        setInitialDisabled(false)
                      }
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      {setPassValue(e.target.value)

                      }
                    }
                  />
                  {isValidPassword && 
                   <span style={{ color: '#ff4d4f', fontSize: '14px' }}>Please type a valid password</span>
                  }
                   </div>
             
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                  </div>
                </div>
       
                <button
                  type="sumbit"
                  style={{ height: '50px', fontSize: '16px' }}
                  disabled={initialDisabled || Boolean(isValidUserName) || Boolean(isValidPassword)}
                  className={`${initialDisabled || Boolean(isValidUserName) || Boolean(isValidPassword) ?  'bg-gray-200' :  'bg-[#00af66] hover:bg-[#1ebd75] buttonCustom '} w-full text-white   focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
                >
                
                 { loginButtonText }
                  
                </button>
                
              </form>
            </div>
          </div>
        </div>
      </section>
          <form onSubmit={onSubmit} style={{ display: 'none' }}>
            <label>
              <input
                type="text"
                className="form-username"
                name="username"
                placeholder="Username"
                onFocus={onUsernameFocus}
                value={userValue}
                onChange={onUsernameChange}
                onBlur={() => (isCheckingInput!.value = false)}
                ref={inputRef}
              />
            </label>
            <label>
              <input
                type="password"
                className="form-pass"
                name="password"
                placeholder="Password (shh.. it's 'teddy')"
                value={passValue}
                onFocus={() => (isHandsUpInput!.value = true)}
                onBlur={() => (isHandsUpInput!.value = false)}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassValue(e.target.value)
                }
              />
            </label>
            <button className="login-btn">{loginButtonText}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginFormComponent;
