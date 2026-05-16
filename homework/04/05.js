const user = {
  name: "小明",
  age: 20,
  skills: ["JavaScript", "HTML", "CSS", "Python"],
  introduce: function() {
    const skillsString = this.skills.join(", ");
    console.log(`大家好，我是 ${this.name}，今年 ${this.age} 歲，我擅長的技能有：${skillsString}`);
  }
};

user.introduce();