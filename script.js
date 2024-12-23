document.addEventListener("DOMContentLoaded",function(){
    const searchButton =document.getElementById("search-btn");
    const usernameInput=document.getElementById("user-input");
    const statsContainer=document.querySelector(".stats-container");
    const easyProgressCircle=document.querySelector(".easy-progress");
    const mediumProgressCircle=document.querySelector(".medium-progress");
    const hardProgressCircle=document.querySelector(".hard-progress");
    const easyLabel=document.getElementById("easy-label");
    const mediumLabel=document.getElementById("medium-label");
    const hardLabel=document.getElementById("hard-label");
    const cardDetail=document.querySelector(".cards");
    const ranking = document.getElementById("ranking");

    function validateUsername(username){
        if(username.trim()===""){
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,14}$/;
        const isMatching=regex.test(username);
        if(!isMatching){
            alert("Invalid username");
            return false;
        }
        return isMatching
    }

    async function fetchUserDetails(username) {
        const url=`https://leetcode-stats-api.herokuapp.com/${username}`;
        try{
            searchButton.textContent="Searching...";
            searchButton.disabled=true;
            const response=await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch user data");
            }
            const parsedData = await response.json();
            console.log("Logging Data :",parsedData);

            displayUserData(parsedData);
        }
        catch(error){
            statsContainer.innerHTML=`<p>${error.message}</p>`
        }
        finally{
            searchButton.textContent="Search";
            searchButton.disabled=false
        }
    }
    function updateProgree(solved,total,label,circle) {
        const progressDegree = (solved/total)*360;
        circle.style.setProperty("--progress-degree",`${progressDegree}deg`);
        label.textContent=`${solved}/${total}`;
    }
    function displayUserData(parsedData) {
        
        const totalHardQues = parsedData.totalHard;
        const totalEasyQues = parsedData.totalEasy;
        const totalMediumQues=parsedData.totalMedium;
        
        const totalEasySol = parsedData.easySolved;
        const totalMediumSol=parsedData.mediumSolved;
        const totalHardSol=parsedData.hardSolved;
        // const totalQuestionsSolved = parsedData.totalSolved;
        const totalQuestionsSolved = parsedData.totalSolved;
    
    updateProgree(totalEasySol,totalEasyQues,easyLabel,easyProgressCircle);
    updateProgree(totalMediumSol,totalMediumQues,mediumLabel,mediumProgressCircle);
    updateProgree(totalHardSol,totalHardQues,hardLabel,hardProgressCircle);
    const v1=parsedData.acceptanceRate
    const v2=parsedData.ranking
    const v3=parsedData.contributionPoints

    cardDetail.innerHTML = displayAdditionalInfo(v1, v2, v3);

    
    }

    function displayAdditionalInfo(acceptanceRate, ranking, contributionPoints) {
        console.log(acceptanceRate, ranking, contributionPoints);
        return `
            <div class="card">
            <h4>Acceptance Rate:</h4> 
            <p>${acceptanceRate}%</p>
            <h4>Ranking:</h4> 
            <p>${ranking}</p>
            <h4>Contribution Points: </h4>
            <p>${contributionPoints}</p>
        </div>`;
    }
    searchButton.addEventListener("click",function(){
        const username=usernameInput.value;
        console.log("loggin username : ",username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }

    })
});