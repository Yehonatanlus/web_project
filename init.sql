CREATE TABLE Users (
    ChatID INT NOT NULL PRIMARY KEY,
    Username varchar(255)
);

CREATE TABLE Admins (
    Username varchar(255) NOT NULL PRIMARY KEY,
    Password CHAR(64) NOT NULL
);

CREATE TABLE Polls (
    PollID INT NOT NULL PRIMARY KEY,
    Description varchar(255) NOT NULL
);

CREATE TABLE Answers (
    AnswerNumber INT NOT NULL,
	PollID INT NOT NULL,
	Description varchar(255) NOT NULL,
    PRIMARY KEY (AnswersNumber,PollID),
    FOREIGN KEY (PollID) REFERENCES Polls(PollID)
);

CREATE TABLE Votes (
    ChatID INT NOT NULL,
	PollID INT NOT NULL,
    AnswerNumber INT NOT NULL,
    PRIMARY KEY (ChatID, PollID, AnswersNumber),
	FOREIGN KEY (ChatID) REFERENCES Users(ChatID),
    FOREIGN KEY (AnswersNumber, PollID) REFERENCES Answers
);