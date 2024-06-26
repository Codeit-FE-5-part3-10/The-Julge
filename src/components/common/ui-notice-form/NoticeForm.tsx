import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import classNames from 'classnames/bind';
import { Button } from '@/src/components/common/ui-button/Button';
import { formatCurrency } from '@/src/utils/formatCurrency';
import styles from './NoticeForm.module.scss';
import { PostNoticeRequest } from '@/src/types/apis/notice/postNotice';

const cx = classNames.bind(styles);

interface NoticeFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: PostNoticeRequest;
}

const noDefaultValues = {
  hourlyPay: 0,
  startsAt: '',
  workhour: 0,
  description: '',
};

export const NoticeForm: React.FC<NoticeFormProps> = ({ onSubmit, defaultValues }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: defaultValues || noDefaultValues,
  });

  return (
    <form className={cx('container')} onSubmit={handleSubmit(onSubmit)}>
      <div className={cx('box', 'hourlyPay')}>
        <label htmlFor="hourlyPay">시급*</label>
        <Controller
          name="hourlyPay"
          control={control}
          rules={{
            required: '값을 입력해주세요',
            min: { value: 10000, message: '최저시급은 9,000원입니다.' },
            pattern: {
              value: /^[0-9]+$/,
              message: '숫자만 입력 가능합니다.',
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <input
                type="text"
                {...field}
                value={formatCurrency(field.value)}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/[^0-9]/g, '');
                  const newValue = rawValue ? parseInt(rawValue, 10) : 0;
                  field.onChange(newValue);
                }}
                className={cx('input')}
              />
              {error && <p className={cx('error')}>{error.message}</p>}
            </div>
          )}
        />
      </div>

      <div className={cx('box', 'startsAt')}>
        <label htmlFor="startsAt">시작 일시*</label>
        <Controller
          name="startsAt"
          control={control}
          rules={{ required: '값을 선택해주세요' }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <input
                type="datetime-local"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                className={cx('input')}
              />
              {error && <p className={cx('error')}>{error.message}</p>}
            </div>
          )}
        />
      </div>

      <div className={cx('box', 'workhour')}>
        <label htmlFor="workhour">업무 시간*</label>
        <Controller
          name="workhour"
          control={control}
          rules={{ required: '값을 입력해주세요' }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <input
                {...field}
                type="text"
                className={cx('input')}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const newValue = Number.isNaN(Number(inputValue)) ? 0 : parseInt(inputValue, 10);
                  field.onChange(newValue);
                }}
              />
              {error && <p className={cx('error')}>{error.message}</p>}
            </div>
          )}
        />
      </div>

      <div className={cx('box', 'description')}>
        <label htmlFor="description">공고 설명*</label>
        <Controller
          name="description"
          control={control}
          rules={{
            required: '값을 입력해주세요',
            maxLength: { value: 200, message: '설명은 200자 이내로 입력해주세요.' },
          }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <textarea {...field} rows={4} className={cx('textarea')} />
              {error && <p className={cx('error')}>{error.message}</p>}
            </div>
          )}
        />
      </div>

      <div className={cx('box', 'button')}>
        <Button type="submit" color="primary">
          {defaultValues ? '수정하기' : '등록하기'}
        </Button>
      </div>
    </form>
  );
};

export default NoticeForm;
