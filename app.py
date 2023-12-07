# app.py
from flask import Flask, render_template, request, send_file, session, redirect, url_for, flash
import os
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.image as img
import make_graph
import pymysql

matplotlib.use('Agg')  # 백엔드 설정

app = Flask(__name__)
app.secret_key = 'bigdata_db'

# Flask 애플리케이션에서 멀티 스레드 사용 설정
app.config['ENV'] = 'development'
app.config['DEBUG'] = True
app.config['THREADING'] = True

#
# MySQL 연결
# #
config = {
    "host": "localhost",
    "user": "root",
    "password": "sj12345",
    "db": "bigdata2023",
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor
}

conn = pymysql.connect(**config)

# bigdata_member 테이블 선택
user_table = 'bigdata_member'

#
# 로그인 및 회원가입 구현
# #
@app.route('/', methods=['GET', 'POST'])
def start():
    if request.method == 'POST':
        if 'signInId' in request.form:  # Sign-in form submitted
            inId = request.form['signInId']
            inPw = request.form['signInPw']
            
            # 커서 생성
            with conn.cursor() as cursor:
                query = f"SELECT * FROM {user_table} WHERE id = %s AND password = %s"
                cursor.execute(query, (inId, inPw))
                result = cursor.fetchone()
            
                

            if result:
                with conn.cursor() as cursor:
                    namequery = f"SELECT name FROM {user_table} WHERE id = %s"
                    cursor.execute(namequery, (inId,))
                    rsName = cursor.fetchone()

                if rsName:
                    session['signInId'] = rsName['name']
                    return redirect(url_for('index'))
                else:
                    # 예외 처리: 해당 ID에 대한 이름이 없을 때의 처리
                    flash('로그인 실패. 사용자 이름 또는 비밀번호를 확인하세요.', 'error')
            else:
                # 로그인 실패 시 플래시 메시지
                flash('사용자 이름 또는 비밀번호를 확인하세요.', 'error')

        elif 'signUpId' in request.form:  # Sign-up form submitted
            upId = request.form.get('signUpId')
            upPw = request.form.get('password')
            upName = request.form.get('name')
            upEmail = request.form.get('email')
            upPhone = request.form.get('phone-num')

            # 커서 생성
            with conn.cursor() as cursor:
                query = f"INSERT INTO {user_table} (id, password, name, email, phoneNum) VALUES (%s, %s, %s, %s, %s)"
                cursor.execute(query, (upId, upPw, upName, upEmail, upPhone))
                conn.commit()    
            
            # flash('회원가입 성공!', 'success')
    
    return render_template('start.html')  # 이 부분에 메인 페이지의 HTML 파일명을 넣어주세요


@app.route('/logout')
def logout():
    if 'signInId' in session:
        # 세션에서 사용자 정보 삭제
        session.pop('signInId', None)
    return redirect('/')

# 대기 화면
@app.route('/index')
def index():
    if 'signInId' in session:
        username = session['signInId']
        return render_template('index.html', image_path=None, user=username)

# 메인 페이지
@app.route('/main')
def main():
    if 'signInId' in session:
        username = session['signInId']
        return render_template('main.html', user=username)


@app.route('/update_image', methods=['POST'])
def update_image():
    input_word = request.form['news_input']

    # make_graph.py 실행
    path = make_graph.main(input_word)

    # 이미지 파일 경로
    output_image_path = f'static/graph/{input_word}.png'

    # 그래프 이미지를 생성
    # create_graph(path, output_image_path)

    # 이미지 파일의 경로를 반환
    return output_image_path


# def create_graph(input_path, output_path):
#     # 그래프 이미지 생성
#     image = img.imread(input_path)
#     plt.imshow(image)
#     plt.axis('off')
#     plt.savefig(output_path)
#     plt.close()


if __name__ == '__main__':
    # 외부에서 접속 가능한 모든 IP 주소, 포트 8000으로 설정
    app.run(port=5000, debug=True)