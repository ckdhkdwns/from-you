import { getUserAddresses } from '@/models/actions/user-actions';
import AddressList from './_components/address-list';

export default async function AddressPage({
    params,
}: {
    params: Promise<{ addressType: 'recipient' | 'sender' }>;
}) {
    const { addressType } = await params;
    const { data: addresses, error } = await getUserAddresses(addressType);

    if (error) {
        return <div>{error.message}</div>;
    }

    return (
        <div className="">
            <AddressList addresses={addresses} addressType={addressType} />
        </div>
    );
}
