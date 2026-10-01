const IMG = "https://apps.azdot.gov/mvd/PracticeTest/images/";
const q = (source, number, prompt, choices, answer, image = "") => ({
  id: `${source}-${number}`, source, number, prompt, choices, answer,
  image: image ? `${IMG}${image}` : "",
  explanation: EXPLANATIONS[`${source}-${number}`]
});

// Public sample questions from the three Arizona MVD Driver License Practice Tests.
const QUESTIONS = [
  q(1,1,"The speed limit approaching a school crosswalk is:",["15 mph","20 mph","25 mph"],0),
  q(1,2,"A school bus is stopped on a four-lane road with its stop-sign arm extended, you must:",["Slow down and proceed with caution","Stop if you are moving in the same direction of travel","Stop regardless of your direction of travel"],2),
  q(1,3,"All arrived at an uncontrolled intersection at the same time. Which has the right-of-way?",["Car 2","Car 1","Car 3"],2,"Test1Q3.jpg"),
  q(1,4,"When you see or hear an emergency vehicle approaching:",["Immediately drive to the right side of the road and stop","Slow down and permit the emergency vehicle to pass","Remain alert and stay to the right"],0),
  q(1,5,"This hand signal means:",["Right turn","Stopping or slowing","Left turn"],1,"Test1Q5.jpg"),
  q(1,6,"You should give the right-of-way to any pedestrian who is:",["In a marked crosswalk","Crossing any street","In any crosswalk or intersection"],1),
  q(1,7,"When driving on wet roads you should:",["Reduce your speed","Pump your brakes occasionally","Switch to low beam headlights"],0),
  q(1,8,"Before entering a road from an alley or driveway, you must:",["Flash your high beam headlights","Sound your horn","Stop before reaching the sidewalk"],2),
  q(1,9,"When backing, you should:",["Look in your inside rearview mirror","Turn and look out the rear window","Turn and look out the driver window"],1),
  q(1,10,"The car that made a correct turn was:",["Car 2","Car 1","Car 3"],2,"Test1Q10.jpg"),
  q(1,11,"If you are parking uphill and there is a curb, you should:",["Turn your wheels to the right, toward the curb","Keep your wheels straight ahead","Turn your wheels to the left, away from the curb"],2),
  q(1,12,"When no speed limit is posted, the maximum speed in a business or residential area is:",["30 mph","25 mph","35 mph"],1),
  q(1,13,"When driving a vehicle, you may:",["Talk to more than one passenger in the vehicle","Write or read any text-based communication","Watch, record or broadcast video"],0),
  q(1,14,"If you intend to turn beyond an intersection, you should:",["Wait to signal your turn until you are in the intersection","Signal your turn as you approach the intersection","Use a hand signal"],0),
  q(1,15,"It is illegal to follow fire vehicles traveling in response to an alarm, within:",["500 feet","200 feet","300 feet"],0),
  q(1,16,"If you approach a school bus that is picking up or dropping off children, you must:",["Stop and then proceed with caution","Stop until the bus is moving or the stop sign arm is no longer extended","Slow and yield the right-of-way to all pedestrians"],1,"Test1Q16.jpg"),
  q(1,17,"This hand signal means:",["Right turn","Stopping or slowing down","Left turn"],2,"Test1Q17.jpg"),
  q(1,18,"It is safe to return to your lane after passing when:",["You can see both headlights of the vehicle in your inside rearview mirror","The driver you just passed signals you over","When you can see the driver in your side mirror"],0,"Test1Q18.jpg"),
  q(1,19,"If you are parking downhill, you should:",["Keep your wheels straight ahead","Turn your wheels to the left, away from the edge of the road","Turn your wheels to the right, toward the edge of the road"],2),
  q(1,20,"Before you make a turn, use your turn signals:",["For at least 500 feet","For at least 4 seconds","Only when other vehicles can be seen on the road"],1),
  q(1,21,"It is illegal to park if a crosswalk is within:",["20 feet","10 feet","15 feet"],0),
  q(1,22,"Before you turn, you must signal continuously for at least:",["50 feet","100 feet","75 feet"],1),
  q(1,23,"This hand signal means:",["Stopping or slowing down","Left turn","Right turn"],2,"Test1Q23.jpg"),
  q(1,24,"The wheelchair symbol in a parking space means that it is reserved for disabled persons:",["But may be used by any driver if no other space is available","But may be used by any driver for loading and unloading","With no exceptions"],2,"Test1Q24.jpg"),
  q(1,25,"The white car will turn left. The black car will go straight. Which has the right-of-way?",["Black car","White car","Neither car"],0,"Test1Q25.jpg"),
  q(1,26,"To make a left turn, you should turn into:",["Lane 1","Lane 2","Either lane 1 or lane 2"],1,"Test1Q26.jpg"),
  q(1,27,"It is illegal to park if a fire hydrant is within:",["15 feet","5 feet","10 feet"],0),
  q(1,28,"A school bus with flashing lights has stopped on a divided highway. Who must stop?",["Cars 1 and 2","Car 1 only","Cars 2 and 3"],2,"Test1Q28.jpg"),
  q(1,29,"If you are parking uphill and there is no curb, you should:",["Turn your wheels to the right, toward the edge of the road","Turn your wheels to the left, away from the edge of the road","Keep your wheels straight ahead"],0),
  q(1,30,"This sign means:",["Curves ahead","Slippery when wet","Hill ahead"],1,"Test1Q30.jpg"),
  q(1,31,"When observing law enforcement lights and/or sirens activated behind you, drivers should:",["Immediately yield to the right side of the roadway","Accelerate","Brake immediately"],0),
  q(1,32,"When stopped by law enforcement, drivers should:",["Put the car in park and remain in the vehicle","Keep your seatbelt fastened and hands on the steering wheel in a visible location","All of the above"],2),
  q(1,33,"When stopped by law enforcement, if there is a firearm in the vehicle, the driver should:",["Keep your hands on the steering wheel in a visible location","If requested, let the officer know that you have a firearm in the vehicle and where the firearm is located.","All of the above"],2),
  q(1,34,"Signing for or accepting a citation from a law enforcement officer:",["Is not an admission of guilt or responsibility","Is a promise to appear in the case of a criminal violation","All of the above"],2),
  q(1,35,"What do you do after a non-injury, fender bender collision?",["Remove the vehicle from the roadway if it is operable and can be moved safely","Stay put and wait for emergency responders","Immediately check your car for damage"],0),

  q(2,1,"A sign with this shape means:",["Yield right-of-way","Speed and direction regulation","Railroad crossing"],1,"Test2Q1.jpg"),
  q(2,2,"A red painted curb means you may:",["Stop to load or unload only","Not stop, stand or park","Stop to pick up or drop off passengers only"],1),
  q(2,3,"A green lighted arrow on a traffic light means you may:",["Proceed in the direction of the arrow after you have come to a complete stop","Not proceed in the direction of the arrow","Proceed in the direction of the arrow without stopping"],2),
  q(2,4,"A sign with this shape means:",["Warning","Railroad crossing","Yield right-of-way"],0,"Test2Q4.jpg"),
  q(2,5,"You are approaching an intersection where the lighted arrow has just changed to yellow:",["You must stop and wait for the light to turn green","You should slow down and turn with caution","You may turn only if you can clear the intersection before the light changes to red"],0),
  q(2,6,"Unless prohibited by a sign, a left turn on red is permitted:",["Except in school zones","From a two-way road to a one-way road","From a one-way road to a one-way road"],2),
  q(2,7,"This sign means:",["Wrong Way","U-turn is not permitted","Left turn is not permitted"],1,"Test2Q7.jpg"),
  q(2,8,"A broken yellow line in the middle of the road means:",["No passing is permitted in either direction","Passing is permitted in either direction","School zone"],1),
  q(2,9,"This sign means:",["Pedestrians prohibited","Pedestrian crossing","School crossing"],2,"Test2Q9.jpg"),
  q(2,10,"This sign means:",["Divided highway ends","Lane ends ahead","Divided highway begins"],0,"Test2Q10.jpg"),
  q(2,11,"A flashing red traffic light at an intersection means the:",["Same as a Stop sign","Light is about to turn green","Same as a Stop light"],0),
  q(2,12,"A sign with this shape means:",["Speed and direction regulation","Railroad warning","Stop"],1,"Test2Q12.jpg"),
  q(2,13,"A yellow line in the middle of the road means:",["Two-way traffic","School zone","One-way traffic"],0),
  q(2,14,"This sign means:",["Road turns sharply to the left","No left turn permitted","Left lane must turn left"],1,"Test2Q14.jpg"),
  q(2,15,"A broken yellow line alongside a solid yellow line in the middle of the road means:",["You may pass if the solid line is on your side","You may pass if the broken line is on your side","No passing is permitted in either direction"],1),
  q(2,16,"A sign with this shape means:",["Stop","Yield right-of-way","Speed limit"],0,"Test2Q16.jpg"),
  q(2,17,"This sign means:",["Pedestrian crossing","School crossing","Construction workers ahead"],0,"Test2Q17.jpg"),
  q(2,18,"You are approaching an intersection where the traffic light has just changed to yellow:",["You should slow down and proceed with caution","You must stop and wait for the light to change to green","You may proceed only if you can clear the intersection before the light changes to red"],1),
  q(2,19,"This sign means:",["Road turns sharply to the right","No right turn permitted","Left lane must turn right"],1,"Test2Q19.jpg"),
  q(2,20,"This sign means:",["Two lanes ahead","Divided highway begins","Two-way traffic"],2,"Test2Q20.jpg"),
  q(2,21,"A broken white line in the middle of the road means:",["Traffic on both sides is moving in the same direction","No passing in either direction","Traffic is moving in opposite directions"],0),
  q(2,22,"This sign means:",["Lane ends","Traffic merging","Left lane must go straight"],1,"Test2Q22.jpg"),
  q(2,23,"A flashing red traffic light at an intersection means you must:",["Stop and wait for the light to change to green","Slow down, check for traffic, then proceed with caution","Stop, check for traffic, then proceed with caution"],2),
  q(2,24,"A sign with this shape means:",["Right turn permitted on red","No passing zone","Railroad crossing"],1,"Test2Q24.jpg"),
  q(2,25,"A sign with this shape means:",["Railroad crossing","Yield right-of-way","Stop"],1,"Test2Q25.jpg"),
  q(2,26,"A right turn on red is allowed:",["Only where indicated by a sign","Except where prohibited by a sign","Only on a divided road"],1),
  q(2,27,"A flashing yellow light at an intersection means you must:",["Stop and wait for the light to change to green","Stop, check for traffic, then proceed with caution","Slow down, check for traffic, then proceed with caution"],2),
  q(2,28,"This sign means:",["You may turn left or go straight","Merging traffic","Divided highway"],0,"Test2Q28.jpg"),
  q(2,29,"A red lighted arrow on a traffic light means:",["No turn permitted","Stop, check for traffic and turn with caution","Stop and wait for the arrow to change to green before turning"],2),
  q(2,30,"A double, solid yellow line in the middle of the road means:",["You are permitted to pass","No passing in either direction","Curve ahead"],1),

  q(3,1,"When following a vehicle at night, lower your high beam headlights when you are within:",["300 feet","100 feet","200 feet"],2),
  q(3,2,"When entering a freeway, you should not:",["Use your turn signal","Match the speed of the traffic in the right lane","Cross a solid line"],2,"Test3Q2.jpg"),
  q(3,3,"To avoid the glare from oncoming headlights:",["Focus your eyes on the center line of the road","Glance back and forth between the side of the road and straight ahead","Focus your eyes on the side of the road"],1),
  q(3,4,"If your vehicle begins to hydroplane you should:",["Release the accelerator","Pull off the road immediately and slow down gradually","Pump the brakes"],0),
  q(3,5,"You should avoid the right lane of the freeway during rush hour:",["To allow emergency vehicles to pass","Because it is the most likely place for accidents","To leave room for vehicles entering and exiting"],2),
  q(3,6,"Switch to low beams when oncoming traffic is within:",["750 feet","300 feet","500 feet"],2),
  q(3,7,"When driving on wet roads you should:",["Reduce your speed","Pump your brakes occasionally","Switch to low beam headlights"],0),
  q(3,8,"If you have a tire blowout:",["Pump the brakes rapidly and pull off the road","Do not brake, but slow down and pull off the road","Turn the wheel in the direction of the skid"],1),
  q(3,9,"If you drive in fog, you should turn on the:",["Low beam headlights","Parking lights","High beam headlights"],0),
  q(3,10,"If you come upon a severe dust storm, you should:",["Maintain your speed and don’t change lanes","Turn on your headlights","Reduce speed and pull off the road"],2),
  q(3,11,"When you merge onto a freeway, you should be driving:",["At the legal speed limit on the freeway","At the same speed as the traffic in the right lane","About 10 mph slower than the speed limit"],1),
  q(3,12,"The best way to bring your vehicle out of a skid is to:",["Turn the wheel in the direction of the skid","Turn the wheel away from the direction of the skid","Pump the brakes"],0),
  q(3,13,"If you are in the black car, the most difficult car for you to see is:",["Car 3","Car 2","Car 1"],1,"Test3Q13.jpg"),
  q(3,14,"You should leave enough space between you and the vehicle directly in front of you:",["To stay out of the other driver's blind spot","So the other driver can see both your headlights in the rearview mirror","To allow for a sudden stop"],2),
  q(3,15,"When changing lanes, check your side mirrors for other traffic and:",["Slow down by at least one third","Check the inside rearview mirror","Turn your head quickly and look over your shoulder"],2),
  q(3,16,"To keep aware of the position of traffic behind you, it is best to:",["Turn your head and look out the rear window","Check your rearview mirror often","Create a space cushion around you"],1),
  q(3,17,"The driver of this vehicle has a “blind spot” in:",["Areas 1 and 3","Area 2","Areas 1 and 2"],0,"Test3Q17.jpg"),
  q(3,18,"Normally, the distance from you to the vehicle ahead should be at least equivalent to:",["5 seconds","3 seconds","2 seconds"],1),
  q(3,19,"If you come to an intersection and your view to the side is blocked, you should:",["Stop, then inch forward until you can see clearly in both directions","Maintain speed and look both ways","Slow down and look both ways"],0),
  q(3,20,"You are required by law to notify the Motor Vehicle Division of a change of address within:",["10 days","30 days","6 months"],0),
  q(3,21,"Penalties for the first conviction for driving under the influence are:",["90 days jail, $3,000, alcohol treatment, community service and ignition interlock.","10 days jail, $1,250, alcohol treatment, community service and ignition interlock.","30 days jail, $1,500, alcohol treatment, community service and ignition interlock."],1),
  q(3,22,"Penalties for the second conviction for driving under the extreme influence are:",["30 days jail, $750, 1 year revocation, alcohol treatment, community service and ignition interlock","60 days jail, $1,500, 90 day suspension, alcohol treatment, community service and ignition interlock","120 days jail, $3,250, 1 year revocation, alcohol treatment, community service and ignition interlock"],2),
  q(3,23,"You are driving under the influence if your blood alcohol concentration is:",["0.08% or above (0.04 if the vehicle requires a commercial license)","0.80% or above (0.40 if the vehicle requires a commercial license)","0.10% or above (0.04 if the vehicle requires a commercial license)"],0),
  q(3,24,"If under age 21, your license may be suspended if your blood alcohol concentration is:",["0.10% or above","0.05% or above","Any amount"],2),
  q(3,25,"You are driving under the extreme influence if your blood alcohol concentration is:",["0.18% or above","0.28% or above","0.15% or above"],2),
  q(3,26,"Bicyclists should:",["Ride facing traffic","Ride with the flow of traffic","Ride on the sidewalk"],1),
  q(3,27,"When passing a bicycle traveling in the same direction, leave a distance of at least:",["3 feet","6 feet","10 feet"],0),
  q(3,28,"Bicyclists must:",["Stay in the right lane at all times","Obey the same traffic laws as motor vehicles","Never pass motor vehicles"],1),
  q(3,29,"It is illegal to follow fire vehicles traveling in response to an alarm, within:",["200 feet","300 feet","500 feet"],2),
  q(3,30,"The Arizona Distracted Driver law prohibits:",["Holding or supporting a wireless device","Having another person in your car","Chewing gum"],0)
];

const app = document.querySelector("#app");
const state = { test: [], answers: {}, studyPool: [], studyQueue: [], studyCurrent: null, studyAnswer: null, checked: false, right: 0, wrong: 0 };

const escapeHTML = (value) => String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
const shuffleChoices = (item) => {
  const order = shuffle(item.choices.map((_, index) => index));
  return {
    ...item,
    choices: order.map(index => item.choices[index]),
    answer: order.indexOf(item.answer)
  };
};
const focusApp = () => { window.scrollTo(0, 0); app.focus({ preventScroll: true }); };

function answerMarkup(item, index, context, status = "") {
  const checked = context === "test" ? state.answers[item.id] === index : state.studyAnswer === index;
  let tag = "";
  if (status === "correct") tag = '<span class="answer-tag">Correct</span>';
  if (status === "wrong") tag = '<span class="answer-tag">Your answer</span>';
  return `<label class="answer ${status}">
    <input type="radio" name="${context}-${item.id}" value="${index}" ${checked ? "checked" : ""} ${status ? "disabled" : ""}>
    <span class="choice-dot" aria-hidden="true"></span>
    <span>${escapeHTML(item.choices[index])}</span>${tag}
  </label>`;
}

function imageMarkup(item) {
  return item.image ? `<img class="question-image" src="${item.image}" alt="Diagram for this question" loading="lazy">` : "";
}

function explanationMarkup(item, open = false) {
  const detail = item.explanation;
  if (!detail) return "";
  return `<details class="explanation" ${open ? "open" : ""}>
    <summary><span>Explanation</span><span class="summary-vi">Giải thích</span><span class="chevron" aria-hidden="true">⌄</span></summary>
    <div class="explanation-body">
      <div><p class="language-label">English</p><p>${escapeHTML(detail.en)}</p></div>
      <div class="translation"><p class="language-label">Tiếng Việt</p><p lang="vi">${escapeHTML(detail.vi)}</p></div>
      <p class="handbook-ref">Handbook section: ${escapeHTML(detail.section)} · Nội dung được diễn giải từ sổ tay MVD.</p>
    </div>
  </details>`;
}

function renderHome() {
  document.title = "AZ Permit Practice";
  app.innerHTML = `<section class="home">
    <p class="eyebrow">Arizona driver knowledge</p>
    <h1>Know the road.<br>Pass with confidence.</h1>
    <p class="lead">Practice with the complete public question pool from Arizona MVD. Take a realistic 30-question test or learn one answer at a time.</p>
    <div class="mode-grid">
      <button class="mode-card primary" id="new-test">
        <span class="mode-icon" aria-hidden="true">30</span>
        <strong>New Test</strong><small>30 random questions · score at the end</small>
      </button>
      <button class="mode-card" id="study">
        <span class="mode-icon" aria-hidden="true">→</span>
        <strong>Study</strong><small>Instant feedback · right & wrong counter</small>
      </button>
    </div>
    <div class="meta-row"><span>${QUESTIONS.length} official sample questions</span><span>80% passing benchmark</span><span>No sign-in required</span></div>
  </section>`;
  document.querySelector("#new-test").addEventListener("click", startTest);
  document.querySelector("#study").addEventListener("click", () => startStudy());
  focusApp();
}

function startTest() {
  state.test = shuffle(QUESTIONS).slice(0, 30).map(shuffleChoices);
  state.answers = {};
  renderTest();
}

function renderTest() {
  document.title = "Practice Test · AZ Permit Practice";
  const answered = Object.keys(state.answers).length;
  app.innerHTML = `<section>
    <div class="screen-head">
      <div><p class="eyebrow">Practice test</p><h1>30 questions</h1><p>Choose the best answer for each question.</p></div>
      <div class="progress-box"><strong>${answered}/30</strong><span>answered</span><div class="progress-track"><div class="progress-fill" style="width:${answered / 30 * 100}%"></div></div></div>
    </div>
    <form id="test-form" class="question-list">
      ${state.test.map((item, i) => `<article class="question-card" id="question-${i + 1}">
        <p class="question-number">Question ${i + 1}</p><h2>${escapeHTML(item.prompt)}</h2>${imageMarkup(item)}
        <div class="answers">${item.choices.map((_, c) => answerMarkup(item, c, "test")).join("")}</div>
      </article>`).join("")}
    </form>
    <div class="sticky-action"><div class="shell sticky-inner"><p id="answer-status">${30 - answered} question${30 - answered === 1 ? "" : "s"} remaining</p><button class="btn" id="submit-test" ${answered !== 30 ? "disabled" : ""}>Submit test</button></div></div>
  </section>`;
  app.querySelectorAll('input[type="radio"]').forEach(input => input.addEventListener("change", event => {
    const id = event.target.name.replace("test-", "");
    state.answers[id] = Number(event.target.value);
    const count = Object.keys(state.answers).length;
    app.querySelector(".progress-box strong").textContent = `${count}/30`;
    app.querySelector(".progress-fill").style.width = `${count / 30 * 100}%`;
    app.querySelector("#answer-status").textContent = `${30 - count} question${30 - count === 1 ? "" : "s"} remaining`;
    app.querySelector("#submit-test").disabled = count !== 30;
  }));
  app.querySelector("#submit-test").addEventListener("click", renderResults);
  focusApp();
}

function renderResults() {
  const correct = state.test.filter(item => state.answers[item.id] === item.answer).length;
  const percent = Math.round(correct / state.test.length * 100);
  const passed = percent >= 80;
  document.title = `Score ${percent}% · AZ Permit Practice`;
  app.innerHTML = `<section>
    <div class="result-hero"><div><p class="eyebrow" style="color:#f0c76e">Test complete</p><h1>${passed ? "You passed." : "Keep studying."}</h1><p>${passed ? "You reached Arizona MVD’s 80% practice benchmark." : `You need 24 correct answers to reach the 80% benchmark. You were ${Math.max(0, 24-correct)} away.`}</p></div>
      <div class="score-ring"><div><strong>${percent}%</strong><small>${correct} of 30</small></div></div></div>
    <div class="result-actions"><button class="btn" id="again">Take another test</button><button class="btn secondary" id="study-missed" ${correct === 30 ? "disabled" : ""}>${correct === 30 ? "No missed questions" : "Study missed questions"}</button><button class="btn secondary" id="result-home">Home</button></div>
    <h2 class="review-title">Answer review</h2>
    <div class="question-list">${state.test.map((item, i) => {
      const picked = state.answers[item.id];
      return `<article class="question-card"><p class="question-number">Question ${i + 1} · MVD sample test ${item.source}</p><h2>${escapeHTML(item.prompt)}</h2>${imageMarkup(item)}
        <div class="answers">${item.choices.map((_, c) => answerMarkup(item, c, "review", c === item.answer ? "correct" : c === picked ? "wrong" : "")).join("")}</div>
        ${explanationMarkup(item, picked !== item.answer)}</article>`;
    }).join("")}</div>
  </section>`;
  app.querySelector("#again").addEventListener("click", startTest);
  app.querySelector("#result-home").addEventListener("click", renderHome);
  const missedButton = app.querySelector("#study-missed");
  if (correct !== 30) missedButton.addEventListener("click", () => {
    const missed = state.test.filter(item => state.answers[item.id] !== item.answer);
    startStudy(missed);
  });
  focusApp();
}

function startStudy(pool = QUESTIONS) {
  state.studyPool = [...pool];
  state.studyQueue = shuffle(state.studyPool);
  state.studyCurrent = null;
  state.studyAnswer = null;
  state.checked = false;
  state.right = 0;
  state.wrong = 0;
  nextStudyQuestion();
}

function nextStudyQuestion() {
  if (!state.studyQueue.length) state.studyQueue = shuffle(state.studyPool);
  state.studyCurrent = state.studyQueue.pop();
  state.studyAnswer = null;
  state.checked = false;
  renderStudy();
}

function renderStudy() {
  const item = state.studyCurrent;
  document.title = "Study · AZ Permit Practice";
  app.innerHTML = `<section class="study-wrap">
    <div class="study-stats"><button class="btn secondary" id="study-home">← Home</button><div class="stat-group"><span class="stat good">${state.right} right</span><span class="stat bad">${state.wrong} wrong</span></div></div>
    <article class="study-card"><p class="question-number">MVD sample test ${item.source} · Question ${item.number}</p><h1>${escapeHTML(item.prompt)}</h1>${imageMarkup(item)}
      <div class="answers">${item.choices.map((_, c) => {
        let status = "";
        if (state.checked && c === item.answer) status = "correct";
        else if (state.checked && c === state.studyAnswer) status = "wrong";
        return answerMarkup(item, c, "study", status);
      }).join("")}</div>
      ${state.checked ? `<div class="feedback ${state.studyAnswer === item.answer ? "good" : "bad"}">${state.studyAnswer === item.answer ? "Correct — nice work." : `Not quite. The correct answer is “${escapeHTML(item.choices[item.answer])}.”`}</div>${explanationMarkup(item, state.studyAnswer !== item.answer)}` : ""}
      <div class="study-actions"><span></span>${state.checked ? '<button class="btn" id="next-study">Next question →</button>' : '<button class="btn" id="check-study" disabled>Check answer</button>'}</div>
    </article>
  </section>`;
  app.querySelector("#study-home").addEventListener("click", renderHome);
  if (!state.checked) {
    app.querySelectorAll('input[type="radio"]').forEach(input => input.addEventListener("change", event => {
      state.studyAnswer = Number(event.target.value);
      app.querySelector("#check-study").disabled = false;
    }));
    app.querySelector("#check-study").addEventListener("click", () => {
      state.checked = true;
      if (state.studyAnswer === item.answer) state.right++; else state.wrong++;
      renderStudy();
    });
  } else {
    app.querySelector("#next-study").addEventListener("click", nextStudyQuestion);
  }
}

document.querySelector("#brand-home").addEventListener("click", renderHome);
renderHome();
