import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function MapsExample() {
  const Map = useMemo(
    () =>
      dynamic(() => import("../../components/maps/MapComponent"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return (
    <Map routeGeometry="stkdC|yfoRCxFyA@[?cB@aB@aB@cBBeB@aB@wC@?l@Aj@k@?iK@yDKqA?mA?MDu@F}KMgEFy@hAa@h@_CjDqBzCk@x@gA~AQz@YzACTOrCCfC?vABpCOLuCfCsBzBuBvCQ`@iDyAoAu@}@s@USgF{CoBmAm@c@qA}Ac@k@a@G_Ac@cCiAMDm@Xs@\wChCm@f@UDeBGe@Aa@C}EK}@A_ACgCEMMCAQCSFMNCHgAC_EAwA@K?_B@cA@W?}ArBkAxAcDvDMq@kEdAeEx@gEhAcE`AkE`AkEbAsA\m@NeAPgEbAo@N_@gBYDc@gBMBiB`@iEbAgE`AgE`A}Bb@iA\_AwEs@PsBb@k@LLn@UDE@YFC@Jf@aARElB?d@K~GyBEICyCkBMEY@}GPiDLcCLsBD?KIg@Q[SMYGmBb@iB`@}D~@[H{Bn@e@J}A^BZw@JAUqCp@Q[WAy@?UAGBY^G?Yc@O^qACQAq@Ay@CwAEc@Ai@AC|@o@Am@Ak@A_@Ak@ACPADGBU?o@HSAc@Oq@GAUeCE{AEaCMs@@g@\}AAo@A_AAm@CcDEQ?_EGK?kACUAs@AE_@Ss@CQ@yAOG@wAG@GMIE"></Map>
  );
}
