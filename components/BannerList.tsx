export default function BannerList({
  availableBanners,
}: {
  availableBanners: any[];
}) {
  return (
    <div>
      {availableBanners.map((banner) => {
        return <div key={banner}></div>;
      })}
    </div>
  );
}
