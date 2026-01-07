declare global {
  interface Window {
    Kakao: any;
  }
}

export const initKakao = () => {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init('db5bae3d536d40594691111c8f1418c8');
    console.log('✅ 카카오 SDK 초기화 완료');
  }
};

export const sendTBMSignRequest = (data: {
  userName: string;
  tbmName: string;
  tbmDate: string;
  location: string;
  tbmId: string;
}) => {
  if (!window.Kakao) {
    alert('카카오톡이 로드되지 않았습니다.');
    return;
  }

  window.Kakao.Share.sendDefault({
    objectType: 'text',
    text: `[에스피네이처 알림]\n\n${data.userName}님 안녕하세요.\nTBM 회의 참석 서명 요청입니다.\n\n■ TBM명: ${data.tbmName}\n■ 일시: ${data.tbmDate}\n■ 장소: ${data.location}\n\n아래 버튼을 클릭하여 참석 서명을 완료해주세요.`,
    link: {
      mobileWebUrl: 'http://localhost:5173',
      webUrl: 'http://localhost:5173',
    },
    buttons: [
      {
        title: '전자서명 하기',
        link: {
          mobileWebUrl: 'http://localhost:5173',
          webUrl: 'http://localhost:5173',
        },
      },
    ],
  });
};

export const sendApprovalRequest = (data: {
  userName: string;
  documentType: string;
  createdDate: string;
  requesterName: string;
  documentId: string;
}) => {
  if (!window.Kakao) {
    alert('카카오톡이 로드되지 않았습니다.');
    return;
  }

  window.Kakao.Share.sendDefault({
    objectType: 'text',
    text: `[에스피네이처 알림]\n\n${data.userName}님 안녕하세요.\n작업허가서 결재 요청입니다.\n\n■ 문서종류: ${data.documentType}\n■ 작성일: ${data.createdDate}\n■ 작성자: ${data.requesterName}\n\n아래 버튼을 클릭하여 결재를 진행해주세요.`,
    link: {
      mobileWebUrl: 'http://localhost:5173',
      webUrl: 'http://localhost:5173',
    },
    buttons: [
      {
        title: '전자서명 하기',
        link: {
          mobileWebUrl: 'http://localhost:5173',
          webUrl: 'http://localhost:5173',
        },
      },
    ],
  });
};

export const sendCertificateRequest = (data: {
  userName: string;
  courseName: string;
  completionDate: string;
  deadline: string;
  userId: string;
}) => {
  if (!window.Kakao) {
    alert('카카오톡이 로드되지 않았습니다.');
    return;
  }

  window.Kakao.Share.sendDefault({
    objectType: 'text',
    text: `[에스피네이처 알림]\n\n${data.userName}님 안녕하세요.\n교육 이수증 제출 요청입니다.\n\n■ 교육과정: ${data.courseName}\n■ 교육완료일: ${data.completionDate}\n■ 제출기한: ${data.deadline}\n\n아래 버튼을 클릭하여 이수증을 업로드해주세요.`,
    link: {
      mobileWebUrl: 'http://localhost:5173',
      webUrl: 'http://localhost:5173',
    },
    buttons: [
      {
        title: '이수증 제출하기',
        link: {
          mobileWebUrl: 'http://localhost:5173',
          webUrl: 'http://localhost:5173',
        },
      },
    ],
  });
};