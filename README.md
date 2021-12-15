![alt text](https://github.com/siflu/nav-vote/blob/main/src/assets/logo.png?raw=true)

nav vote is a lightwallet created during the navcoin-js hackathon.
It enables you to have privacy oriented voting capabilities via the Navcoin blockchain using xNAV.
With the wallet, you can:
- create polls
- freely define the options you want to vote on 
- send the poll to multiple (1-n) receivers

These receivers have the possibility to vote for an option for the polls they received.

With this wallet, you also have the possibility to register a dotNav name.
dotNav names can be used when sending a poll to the voters.

## Possible use cases
- A family of four want to have a vote what to eat for dinner
- A group of friends want to meet and have to find a date when everyone is available
- A government wants their citizens to vote on something
- etc.

## Additional information
- The poll has been secured from manipulation by only allowing votes from initially defined receipients of the poll
- The answers of the poll have been secured from manipulation by only allowing options that have been initially defined when creating the poll

## Ideas that will be worked on in the future
- While creating the poll, have the option to limit the number of answers per voter to 1.
- While creating the poll, have the option to set an enddate to accept votes.

## Where to find nav vote
If you want to use nav vote you can find the current version running at https://nav-vote.web.app/
or you could clone the code and run it yourself:

### Clone the code
`git clone https://github.com/siflu/nav-vote.git`

### Install the npm packages
`npm install`

### Start the application
`yarn start`