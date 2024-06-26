import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Layout } from '@/src/layouts/feature-layout/Layout';
import { getShopSingleNotice } from '@/src/apis/notices';
import { Section } from '@/src/layouts/section/Section';
import { DetailNotice } from '@/src/components/notice-page/ui-detail-notice/DetailNotice';
import { ListApplication } from '@/src/components/notice-page/feature-list-applications/ListApplications';
import { ModalProvider } from '@/src/contexts/ModalContext';
import { NoticeDetail } from '@/src/components/detail-page/ui-noticeDetail-page/NoticeDetail';
import { useToken } from '@/src/utils/TokenProvider';
import { getUserItem } from '@/src/apis/user';
import { RecentNotice } from '@/src/components/detail-page/ui-recent-notice/RecentNotice';

export default function Notice() {
  const router = useRouter();
  const { userInfo } = useToken();
  const { shop_id, notice_id } = router.query;
  const [userType, setUserType] = useState('');
  const [myShopId, setMyShopId] = useState<string>();
  const [isMyShop, setIsMyShop] = useState<boolean>();
  // shopId와 noticeId가 undefined일 경우 빈 문자열로 초기화
  const shopId = Array.isArray(shop_id) ? shop_id[0] : shop_id || '';
  const noticeId = Array.isArray(notice_id) ? notice_id[0] : notice_id || '';
  useEffect(() => {
    if (userInfo?.type === 'employer') {
      setUserType('employer');
    } else if (userInfo?.type === 'employee') {
      setUserType('employee');
    } else {
      setUserType('');
    }
    const fetchMyShopId = async () => {
      // 사용자 정보로부터 해당 사용자의 상점 ID를 가져옵니다.
      const userId = userInfo?.id;
      if (userId) {
        const result = await getUserItem(userId);
        const myShopID = result?.item.shop?.item.id;
        // 페이지 진입 전에 isMyShop 값을 설정합니다.
        setIsMyShop(shopId === myShopID);
      }
    };
    fetchMyShopId();
  }, [userInfo, myShopId]);

  const { data, error, isLoading } = useQuery({
    queryKey: ['getShopSingleNotice', shopId, noticeId],
    queryFn: async () => {
      const response = await getShopSingleNotice(shopId, noticeId);
      return response;
    },
    enabled: !!shopId && !!noticeId,
  });

  const userId = userInfo?.id;
  const { data: profileData } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (userId) {
        const result = await getUserItem(userId);
        setMyShopId(profileData?.item.shop?.item.id);
        return result;
      }
      return null;
    },
    enabled: !!userId,
  });

  // shopId와 noticeId가 유효한지 확인하는 조건을 훅 호출 후로 이동
  if (typeof shopId !== 'string') {
    return <div>Invalid shop ID</div>;
  }

  if (typeof noticeId !== 'string') {
    return <div>Invalid notice ID</div>;
  }

  // TODO: 로딩, 오류 처리
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading shop data</div>;
  }

  // 데이터와 data.item이 정의되어 있는지 확인
  if (!data || !data.item) {
    return <div>No data</div>;
  }

  const { hourlyPay, startsAt, workhour, description: noticeDescription, closed } = data.item;
  const {
    address1,
    imageUrl,
    description: shopDescription,
    originalHourlyPay,
  } = data.item.shop.item;
  const notice = {
    wage: hourlyPay,
    originalWage: originalHourlyPay,
    date: startsAt.toString(),
    time: workhour,
    noticeDescription,
    shopDescription,
    closed,
    location: address1,
    imageUrl,
  };

  return (
    <Layout>
      {userType === 'employer' && isMyShop ? (
        <>
          <Section
            title={data.item.shop.item.name}
            content={<DetailNotice params={notice} shopId={shopId} noticeId={noticeId} />}
            gray
          />
          <ModalProvider>
            <Section title="신청자 목록" content={<ListApplication />} gray />
          </ModalProvider>
        </>
      ) : (
        (userType === 'employee' || userType === '' || userType === 'employer') && (
          <>
            <Section
              title={data.item.shop.item.name}
              content={<NoticeDetail params={notice} noticeId={noticeId} shopId={shopId} />}
              gray
            />
            <Section title="최근에 본 공고" content={<RecentNotice />} />
          </>
        )
      )}
    </Layout>
  );
}
