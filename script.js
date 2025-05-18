// HTML 요소 가져오기
const canvas = document.getElementById('circle');
const ctx = canvas.getContext('2d');
const timeText = document.getElementById('timeText');
const alarm = document.getElementById('alarm');

// 타이머 상태 변수들
let isRunning = false;       // 타이머 실행 중 여부
let timer;                   // setInterval을 담을 변수
let startTime;               // 타이머 시작 시간 저장
let focusDuration = 25 * 60; // 집중 시간 (25분)
let breakDuration = 5 * 60;  // 휴식 시간 (5분)
let mode = 'focus';          // 현재 모드: 'focus' 또는 'break'
let totalTime = focusDuration; // 현재 모드의 전체 시간
let timeLeft = totalTime;      // 현재 남은 시간
let sessionCount = 0; // 세션 변수

// 원형 프로그레스 바를 그림
function drawCircle(progress) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 초기화

  // 회색 배경 원
  ctx.beginPath();
  ctx.arc(100, 100, 90, 0, 2 * Math.PI); // 중심(100,100), 반지름 90
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 10;
  ctx.stroke();

  // 진행 원 (남은 시간 비율에 따라 색상 원형)
  ctx.beginPath();
  ctx.arc(100, 100, 90, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * progress);
  ctx.strokeStyle = mode === 'focus' ? '#3b82f6' : '#10b981'; // 모드별 색상 (파랑 / 초록)
  ctx.lineWidth = 10;
  ctx.stroke();
}

// 화면에 시간 표시 및 게이지 업데이트
function updateDisplay() {
  const min = String(Math.floor(timeLeft / 60)).padStart(2, '0'); // 분
  const sec = String(timeLeft % 60).padStart(2, '0');             // 초
  timeText.textContent = `${min}:${sec}`; // "MM:SS" 형태로 표시
  drawCircle(timeLeft / totalTime);       // 진행률 비율로 원형 게이지 그림
}

// 집중 ↔ 휴식 전환
function switchMode() {
  if (mode === 'focus') {
    mode = 'break';                // 휴식 모드로 변경
    totalTime = breakDuration;     // 휴식 시간 설정
  } else {
    mode = 'focus';                // 다시 집중 모드로 변경
    totalTime = focusDuration;
    sessionCount++;
    updateSessionDisplay();
  }
  timeLeft = totalTime;            // 남은 시간 초기화
  updateDisplay();                 // 바로 UI 업데이트
  startTimer();                    // 자동으로 다음 타이머 시작
}

// 타이머 시작
function startTimer() {
  if (isRunning) return;           // 이미 실행 중이면 무시
  isRunning = true;
  startTime = Date.now();          // 시작 시간 기록

  timer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000); // 경과 시간 계산
    timeLeft = totalTime - elapsed;

    if (timeLeft <= 0) {           // 시간이 다 됐으면
      clearInterval(timer);
      alarm.play();                // 알람 재생
      isRunning = false;
      timeLeft = 0;
      updateDisplay();
      setTimeout(switchMode, 2000); // 2초 후 자동 전환
    } else {
      updateDisplay();             // 남은 시간 표시
    }
  }, 1000); // 매초 실행
}

// 일시정지
function pauseTimer() {
  clearInterval(timer);    // 타이머 멈춤
  totalTime = timeLeft;    // 현재 남은 시간을 저장해서 재시작할 수 있게 함
  isRunning = false;
}

function updateSessionDisplay() {
    document.getElementById('sessionCount').textContent = `총 세션: ${sessionCount}`;
  }
  

// 초기화 (완전 리셋)
function resetTimer() {
  clearInterval(timer);       // 타이머 멈춤
  isRunning = false;
  mode = 'focus';             // 기본 모드로 돌아감
  totalTime = focusDuration;  // 25분
  timeLeft = totalTime;
  sessionCount = 0;
  updateDisplay();
  updateSessionDisplay();
}

// 버튼 이벤트 연결
document.getElementById('start').onclick = startTimer;
document.getElementById('pause').onclick = pauseTimer;
document.getElementById('reset').onclick = resetTimer;

// 최초 화면 표시
updateDisplay();
