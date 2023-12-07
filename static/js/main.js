// 요약 버튼 클릭 시 이벤트
function toggleSummary() {
    const search = document.getElementById('search');
    const content1 = document.getElementById('content1');
    const content2 = document.getElementById('content2');
    const tabs = document.getElementById('tabs');
    const chartContainer = document.getElementById('chartContainer');
    const contentTitle = document.getElementById('content-title');
    const wordCloudBox = document.getElementById('word-cloud-box');
    const content1Title = document.getElementById('content1-title');
    const creatorBox = document.getElementById('project-creator');

    // 요약 버튼을 누를 때 search 크기를 1200으로 증가시키고 tabs를 함께 이동
    search.classList.toggle('expanded');
    content1.classList.toggle('expanded');
    content2.classList.toggle('expanded');
    tabs.classList.toggle('expanded');
    chartContainer.classList.toggle('expanded')
    contentTitle.classList.toggle('expanded')
    wordCloudBox.classList.toggle('expanded')
    creatorBox.classList.toggle('expanded')

    // h3 요소의 텍스트 변경
    if (search.classList.contains('expanded')) {
        content1Title.innerText = 'Word Cloud와 추출된 단어';
    } else {
        content1Title.innerText = '검색된 결과가 없습니다.';
    }

    // 결과값에 따른 색상 선택
    var result = document.getElementById('result').innerText;
    var color;
    if (result == '긍정입니다.') {
        color = '#00D800';  // 긍정일 경우 초록색
        textColor = '#00D800';  // 긍정일 경우 글씨 색은 검정색
    } else if (result == '부정입니다.') {
        color = '#FF0000';  // 부정일 경우 빨간색
        textColor = '#FF0000';  // 긍정일 경우 글씨 색은 검정색
    }
    // 여기가 퍼센트 수정 부분
    $(document).ready(function () {
        draw(97.8, '.pie-chart1', color);
    });

    $('.center').css('color', textColor);

    function draw(max, classname, colorname) {
        var i = 1;
        var func1 = setInterval(function () {
            if (i < max) {
                color1(i, classname, colorname);
                i++;
            } else {
                clearInterval(func1);
            }
        }, 10);
    }

    function color1(i, classname, colorname) {
        $(classname).css({
            "background": "conic-gradient(" + colorname + " 0% " + i + "%, #ffffff " + i + "% 100%)"
        });
    }

    
}

// 탭 마다 클릭 옵션
function showTab(tabContentId, tabId) {
    // 모든 탭 내용을 숨김
    const tabContents = document.querySelectorAll('.tab_content');
    const tabAll = document.querySelectorAll('.tab');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    tabAll.forEach(content => {
        content.style.backgroundColor = '#6B6B6B';
    });
    

    // 선택한 탭의 내용을 보이게 함
    const selectedTabContent = document.getElementById(tabContentId);
    const selectedTab = document.getElementById(tabId);
    if (selectedTabContent) {
        selectedTabContent.style.display = 'block';
        selectedTab.style.backgroundColor = '#FFFB77';  // 잠시 동안 보여질 색상입니다.
        setTimeout(() => {
            selectedTab.style.backgroundColor = 'white';  // 최종 색상입니다.
        }, 300);
    }
}

// 결과의 퍼센트만큼 표의 색이 변경
window.onload = function() {
    var percent = parseFloat(document.querySelector('.center').textContent);
    var result = document.querySelector('#result').textContent;

    // 배경색 업데이트
    var rows = document.querySelectorAll('table tbody tr');
    rows.forEach(function(row) {
        // 모든 행의 배경색을 초기화
        row.style.backgroundColor = 'white';
        document.querySelector('#good').style.backgroundColor = 'white';
        document.querySelector('#bad').style.backgroundColor = 'white';
    });

    if (result === '긍정입니다.') {
        if (parseFloat(percent) >= 80 && parseFloat(percent) <= 100) {
            document.querySelector('.positive-grade1').style.backgroundColor = '#A2FFA2';
            document.querySelector('#good').style.backgroundColor = '#A2FFA2';
        } else if (parseFloat(percent) >= 51 && parseFloat(percent) < 80) {
            document.querySelector('.positive-grade2').style.backgroundColor = '#A2FFA2';
            document.querySelector('#good').style.backgroundColor = '#A2FFA2';
        }
    } else if (result === '부정입니다.') {
        if (parseFloat(percent) >= 51 && parseFloat(percent) <= 70) {
            document.querySelector('.negative-grade1').style.backgroundColor = '#FF5F5F';
            document.querySelector('#bad').style.backgroundColor = '#FF5F5F';
        } else if (parseFloat(percent) > 70 && parseFloat(percent) <= 80) {
            document.querySelector('.negative-grade2').style.backgroundColor = '#FF5F5F';
            document.querySelector('#bad').style.backgroundColor = '#FF5F5F';
        } else if (parseFloat(percent) > 80 && parseFloat(percent) <= 100) {
            document.querySelector('.negative-grade3').style.backgroundColor = '#FF5F5F';
            document.querySelector('#bad').style.backgroundColor = '#FF5F5F';
        }
    }
}
