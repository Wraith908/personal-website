export class Card {
    constructor(
        public charType = "",
        public firstName ="",
        public lastName = "",
        public genderPres = "",
        public race = "",
        public charClass = "",
        public background = "",
        public challenge = "",
        public goal = "",
        public patron = "", 
        public misc = "",
        public pageRef = ""
    ) {}

    public name() {
        return this.firstName + " " + this.lastName;
    }

    public shortDescriptor() {
        return this.genderPres + " " + this.race + " " + this.charClass;
    }

    public charHistory() {
        return "they spent time as a " + this.background;
    }

    public motivation() {
        return "seeks to " + this.goal + " for " + this.patron + " and is " + this.challenge;
    }

    public references () {
        return this.pageRef;
    }

    public header() {
        return this.charType;
    }
    //Set Functions
    public setHeader(props: string) {
        this.charType = props;
    }

    public setFirstName() {

    }

    public setLastName(props:string) {
        this.lastName = props;
    }

    public setGenderPres(props: string) {
        this.genderPres = props;
    }

    public setRace(props: string) {
        this.race = props;
    }

    public setClass(props: string) {
        this.charClass = props;
    }

    public setBackground(props: string) {
        this.background = props;
    }

    public setChallenge(props: string) {
        this.challenge = props;
    }

    public setGoal(props: string) {
        this.goal = props;
    }

    public addReference(props: string) {
        this.pageRef += props + " ";
    }
}