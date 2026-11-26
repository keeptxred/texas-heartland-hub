import {describe,it,expect} from 'vitest';
import {parseRootDiskMetrics} from './probe-supabase-disk-headroom.mjs';
const labels='device="/dev/x",fstype="ext4",mountpoint="/"';
const sample=(l=labels)=>'node_filesystem_size_bytes{'+l+'} 1.0e9\nnode_filesystem_avail_bytes{'+l+'} 1.05e8\n';
describe('provider physical disk headroom',()=>{
  it('pairs exact root labels and ignores other mounts',()=>{
    expect(parseRootDiskMetrics(sample()+sample('device="tmp",fstype="tmpfs",mountpoint="/tmp"'))).toEqual({totalBytes:1e9,availableBytes:105e6,usedBytes:895e6});
  });
  it('fails closed on ambiguous, incomplete, duplicate and inconsistent series',()=>{
    for (const value of [
      '',sample(labels.replace('ext4','rootfs')),sample()+sample(labels.replace('/dev/x','/dev/y')),
      sample()+sample(),sample().split('\n')[0],
      sample().replace('1.05e8','1.05e10'),
      sample(labels+',supabase_project_ref="other"'),
    ]) expect(()=>parseRootDiskMetrics(value)).toThrow();
  });
});
