import React, { useState } from 'react';
import './factpage.css';
import logoImage from './logo.png';


interface VoteCount {
  fact: number;
  notAFact: number;
  cantBeDetermined: number;
}

const FactPage: React.FC = () => {
  const factLink = 'https://www.example.com';
  const factDescription = 'This is an example fact description.';
  const fact = 'This is the fact to be checked.';
  const [votes, setVotes] = useState<VoteCount>({
    fact: 0,
    notAFact: 0,
    cantBeDetermined: 0
  });
  const [justification, setJustification] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleVote = (vote: string) => {
    if (vote === 'fact') {
      setVotes((prevVotes) => ({
        ...prevVotes,
        fact: prevVotes.fact + 1
      }));
    } else if (vote === 'not-a-fact') {
      setVotes((prevVotes) => ({
        ...prevVotes,
        notAFact: prevVotes.notAFact + 1
      }));
    } else if (vote === "can't-be-determined") {
      setVotes((prevVotes) => ({
        ...prevVotes,
        cantBeDetermined: prevVotes.cantBeDetermined + 1
      }));
    }
  };

  const handleJustificationChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJustification(event.target.value);
  };

  const handleSubmit = () => {
    if (justification.trim() !== '') {
      const submissionData = {
        votes,
        justification
      };
      console.log(submissionData);
      window.location.reload(); 

      setIsSubmitted(true);
      setJustification('');
    }
  };

  const navigateToMainPage = () => {
    window.location.href = '/';
  };

  return (
    <div className="fact-page">
      <div onClick={navigateToMainPage}>
        <img style={{width:"195px",marginLeft:"-1300px",marginTop:"-50px"}} src={logoImage} alt="Logo" className="logo-image" />
      </div>
      <h1 style={{margin:"-35px"}}>Fact Checker App</h1><br/><br/><br/>
      <div className="fact-content">
        <div className="left-content">
          <h2>Fact Link:</h2>
          <a href={factLink}>{factLink}</a>
          <p>{factDescription}</p>
        </div>
        <div className="right-content">
          <div>
            <h3>Fact:</h3>
            <p>{fact}</p>
            {/* <p>Votes: {votes}</p> */}
            <div>
            <button onClick={() => handleVote('fact')}>Fact</button>&nbsp;
            <button onClick={() => handleVote('not-a-fact')}>Not a Fact</button><br/>
            <button style={{margin:"5px"}} onClick={() => handleVote("can't-be-determined")}>Undetermined</button>
            </div>
            <textarea className="justification"
              value={justification}
              onChange={handleJustificationChange}
              placeholder="Enter your justification..."
              rows={4}
            ></textarea>
          </div>
        </div>
      </div>
      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={justification.trim() === '' || isSubmitted}
      >
        Submit
      </button>
    </div>
  );
};

export default FactPage;
