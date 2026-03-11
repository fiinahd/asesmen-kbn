import { useLoaderData, useSearchParams } from "react-router-dom";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const provinceId = url.searchParams.get("province");
  const regencyId = url.searchParams.get("regency");
  const districtId = url.searchParams.get("district");
 
  const response = await fetch('/data/indonesia_regions.json');
  const data = await response.json();
  
  let provinces = data.province;
  let regencies = [];
  let districts = [];

  if (provinceId) {
    regencies = data.regency.filter((r: any) => r.province_id.toString() === provinceId);
  }

  if (regencyId) {
    districts = data.district.filter((d: any) => d.regency_id.toString() === regencyId);
  }

  let selectedProvinceName = null;
  let selectedRegencyName = null;
  let selectedDistrictName = null;

  if (provinceId) {
    const found = provinces.find((p: any) => p.id.toString() === provinceId);
    if (found) selectedProvinceName = found.name;
  }
  
  if (regencyId) {
    const found = regencies.find((r: any) => r.id.toString() === regencyId);
    if (found) selectedRegencyName = found.name;
  }
  
  if (districtId) {
    const found = districts.find((d: any) => d.id.toString() === districtId);
    if (found) selectedDistrictName = found.name;
  }
  
  return {
    provinces,
    regencies,
    districts,
    provinceId: provinceId || "",
    regencyId: regencyId || "",
    districtId: districtId || "",
    selectedProvinceName,
    selectedRegencyName,
    selectedDistrictName
  };
}

export default function FilterPage() {
  const data = useLoaderData() as any;
  const [, setSearchParams] = useSearchParams();

  const changeProvince = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "") {
      setSearchParams({});
    } else {
      setSearchParams({ province: e.target.value });
    }
  };

  const changeRegency = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "") {
      setSearchParams({ province: data.provinceId });
    } else {
      setSearchParams({ province: data.provinceId, regency: e.target.value });
    }
  };

  const changeDistrict = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "") {
      setSearchParams({ province: data.provinceId, regency: data.regencyId });
    } else {
      setSearchParams({ province: data.provinceId, regency: data.regencyId, district: e.target.value });
    }
  };

  const resetFilter = () => {
    setSearchParams({});
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-800">
      <aside className="w-[300px] border-r border-gray-100 p-6 flex flex-col shadow-[1px_0_5px_rgba(0,0,0,0.02)]">
        <h1 className="font-bold text-gray-800 text-lg mb-10">Frontend Assessment</h1>
        
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1">PROVINSI</label>
            <select name="province" value={data.provinceId} onChange={changeProvince} className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
              <option value="">Pilih Provinsi</option>
              {data.provinces.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1">KOTA/KABUPATEN</label>
            <select name="regency" value={data.regencyId} onChange={changeRegency} disabled={!data.provinceId} className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm disabled:bg-gray-50 disabled:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
              <option value="">Pilih Kota/Kabupaten</option>
              {data.regencies.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1">KECAMATAN</label>
            <select name="district" value={data.districtId} onChange={changeDistrict} disabled={!data.regencyId} className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm disabled:bg-gray-50 disabled:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
              <option value="">Pilih Kecamatan</option>
              {data.districts.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <button type="button" onClick={resetFilter} className="mt-6 w-full rounded-lg border border-blue-200 bg-white py-2.5 text-xs font-bold text-blue-900 transition-colors hover:bg-blue-50">
            RESET
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-[#fdfdfd]">
        <div className="breadcrumb px-8 py-4 border-b border-gray-100 flex items-center gap-2 text-xs font-semibold text-gray-400">
          <span>Indonesia</span>
          {data.selectedProvinceName && <> <span className="text-gray-300">&gt;</span> <span>{data.selectedProvinceName}</span> </>}
          {data.selectedRegencyName && <> <span className="text-gray-300">&gt;</span> <span>{data.selectedRegencyName}</span> </>}
          {data.selectedDistrictName && <> <span className="text-gray-300">&gt;</span> <span className="text-blue-500">{data.selectedDistrictName}</span> </>}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-20">
          {data.selectedProvinceName && (
              <div className="text-center mb-8">
                <p className="text-[10px] font-bold text-blue-300 tracking-[0.2em] mb-2 uppercase">PROVINSI</p>
                <h2 className="text-5xl font-extrabold text-[#111827]">{data.selectedProvinceName}</h2>
              </div>
          )}
          {data.selectedRegencyName && (
            <>
              <div className="my-8 text-center text-gray-300 text-2xl font-light">↓</div>
              <div className="text-center mb-8">
                <p className="text-[10px] font-bold text-blue-300 tracking-[0.2em] mb-2 uppercase">KOTA / KABUPATEN</p>
                <h2 className="text-5xl font-extrabold text-[#1f2937]">{data.selectedRegencyName}</h2>
              </div>
            </>
          )}
          {data.selectedDistrictName && (
            <>
              <div className="my-8 text-center text-gray-300 text-2xl font-light">↓</div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-blue-300 tracking-[0.2em] mb-2 uppercase">KECAMATAN</p>
                <h2 className="text-5xl font-extrabold text-[#1f2937]">{data.selectedDistrictName}</h2>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}