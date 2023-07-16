import React, { useEffect, useState, useRef } from 'react';
import './Ap.css';
import logo from '@/assets/Fact.png';


interface Profile {
  name: string;
  email: string;
  ckbtcAddress: string;
  btcAddress: string;
}

export const Ap = () => {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    email: '',
    ckbtcAddress: '',
    btcAddress: '',
  });

  const [showDepositPopup, setShowDepositPopup] = useState(false);
  const [showWithdrawalPopup, setShowWithdrawalPopup] = useState(false);
  const [showCKBTCPopup, setShowCKBTCPopup] = useState(false);
  const [showBTCPopup, setShowBTCPopup] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('profile.json')
      .then(response => response.json())
      .then((data: Profile) => setProfile(data))
      .catch(error => console.log('Error:', error));
  }, []);

  const handleDeposit = () => {
    setShowDepositPopup(true);
  };

  const handleWithdrawal = () => {
    setShowWithdrawalPopup(true);
  };

  const handleCKBTC = () => {
    setShowCKBTCPopup(true);
  };

  const handleBTC = () => {
    setShowBTCPopup(true);
  };

  const handleWithdrawalSubmit = () => {
    // Perform withdrawal submit logic or other actions here
    console.log('Withdrawal amount:', withdrawalAmount);
    setWithdrawalAmount('');
    setShowWithdrawalPopup(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setShowDepositPopup(false);
      setShowWithdrawalPopup(false);
      setShowCKBTCPopup(false);
      setShowBTCPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleWithdrawalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Regex pattern to validate float number with up to two decimal places
    const pattern = /^\d*\.?\d{0,2}$/;
    if (pattern.test(value) || value === '') {
      setWithdrawalAmount(value);
    }
  };

  return (
    <div className="App">
      <div className="top-bar">
      <button className="top-button">Home</button>
      <button className="to-button">Sign Out</button>
    </div>
      <div className="logo">
  <img src={logo} alt="Logo" />
</div>

      <div className="overlay">
        <h2 className="name" style={{fontSize:"20px",fontWeight:"bold"}}>Saranesh Eashwar</h2>
        <p className="email">eashwarsara@gmail.com</p>
        <div className="button-container">
          <button onClick={handleDeposit} className="button" style={{width:"100px",height:"50px",color:"white"}}>Deposit</button>
          <button onClick={handleWithdrawal} className="button" style={{width:"100px",height:"50px",color:"white"}}>Withdraw</button>
        </div>
      </div>
      {showDepositPopup && (
        <div className="popup" ref={popupRef}>
          {/* Content for the deposit popup */}
          <h3>Deposit</h3>
          <div className="button-container">
            <button className="deposit-button" onClick={handleCKBTC}>
              CKBTC
            </button>
            <button className="deposit-button" onClick={handleBTC}>
              BTC
            </button>
          </div>
          <button onClick={() => setShowDepositPopup(false)} className="close-button">
            Close
          </button>
        </div>
      )}
      {showWithdrawalPopup && (
        <div className="popup" ref={popupRef}>
          {/* Content for the withdrawal popup */}
          <h3>Withdrawal</h3>
          <p>Enter the CKBTC amount to withdraw:</p>
          <div className="submit-button-container">
            <input
              type="text"
              value={withdrawalAmount}
              onChange={handleWithdrawalAmountChange}
            />
            <button onClick={handleWithdrawalSubmit} className="submit-button">
              Submit
            </button>
          </div>
          <button onClick={() => setShowWithdrawalPopup(false)} className="close-button">
            Close
          </button>
        </div>
      )}
      {showCKBTCPopup && (
        <div className="popup" ref={popupRef}>
          {/* Content for the CKBTC popup */}
          <h3>CKBTC Deposit</h3>
          <p>Deposit CKBTC to the following address:</p>
          <p>{profile.ckbtcAddress}</p>
          <button onClick={() => setShowCKBTCPopup(false)} className="close-button">
            Close
          </button>
        </div>
      )}
      {showBTCPopup && (
        <div className="popup" ref={popupRef}>
          {/* Content for the BTC popup */}
          <h3>BTC Deposit</h3>
          <p>Deposit BTC to the following address:</p>
          <p>{profile.btcAddress}</p>
          <div className="button-container">
            <button className="update-button">Update</button>
            <button onClick={() => setShowBTCPopup(false)} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ap;
