alter function public.texasdefined_nearest_brand_locations(text, double precision, double precision) security invoker;
alter function public.texasdefined_nearest_bucees(double precision, double precision) security invoker;

revoke all on function public.texasdefined_nearest_brand_locations(text, double precision, double precision) from public, anon, authenticated;
revoke all on function public.texasdefined_nearest_bucees(double precision, double precision) from public, anon, authenticated;

grant execute on function public.texasdefined_nearest_brand_locations(text, double precision, double precision) to service_role;
grant execute on function public.texasdefined_nearest_bucees(double precision, double precision) to service_role;
