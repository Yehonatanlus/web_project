export class PollTree {
  question: string;
  answers: string[];
  followupPolls: (PollTree | null)[];

  constructor(question: string) {
    this.question = question;
    this.answers = [];
    this.followupPolls = [];
  }

  ToJsonInner(poll_tree: PollTree | null) {
    if (poll_tree == null || poll_tree.question.length == 0) return null;
    let json: any = { question: poll_tree.question, answers: [] };
    for (let i = 0; i < poll_tree.answers.length; i++) {
      if (poll_tree.answers[i].length == 0) continue;
      let inner_json = this.ToJsonInner(poll_tree.followupPolls[i]);
      json["answers"].push({ desc: poll_tree.answers[i], poll: inner_json });
    }
    return json;
  }
  ToJson() {
    return this.ToJsonInner(this);
  }

  AddAnswer(answer: string) {
    this.answers.push(answer);
    this.followupPolls.push(null);
  }
}
